/*
 * This fils holds the utility functions that the panelUI file needs
 */

define(function (require, exports, module) {
    const ViewUtils = brackets.getModule("utils/ViewUtils");
    const WorkingSetView = brackets.getModule("project/WorkingSetView");
    const FileSystem = brackets.getModule("filesystem/FileSystem");
    const DocumentManager = brackets.getModule("document/DocumentManager");
    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils");

    const Globals = require("./globals");
    const Preferences = require("./preferences");
    const BookmarksList = require("./bookmarksList");

    /**
     * This function is responsible to get the line content that is to be displayed in the panel UI
     * it uses document manager if the file is open, otherwise reverts back to FileSystem
     *
     * @param {String} filePath - the file path from which we want to get the line content
     * @param {Number} lineNumber - the line number in the file to fetch the content
     * @returns {Promise} - resolving the content of the line
     */
    function getLineContent(filePath, lineNumber) {
        return new Promise((resolve) => {
            // first we try to get the document if it's already open (for efficiency purposes)
            const openDoc = DocumentManager.getOpenDocumentForPath(filePath);

            if (openDoc) {
                // If document is already open, get the line directly
                const lineContent = openDoc.getLine(lineNumber);
                resolve(lineContent ? lineContent.trim() : "");
            } else {
                // If document is not open, we need to read from file system
                const file = FileSystem.getFileForPath(filePath);

                file.read((err, data) => {
                    if (err) {
                        resolve("");
                        return;
                    }

                    const lines = data.split("\n");
                    const lineContent = lines[lineNumber] || "";
                    resolve(lineContent.trim());
                });
            }
        });
    }

    /**
     * This function is responsible to get the file data from the file path
     * such as the file name and directory name.
     * we need the file name and the dir name to display on the panel file header
     *
     * @param {String} filePath - the file path
     * @returns {Object} - an object containing the fileName, dirname, and we also just pass back the whole file path
     */
    function getFilePathData(filePath) {
        // to handle both the Windows and Unix style paths
        const pathSeparator = filePath.includes("\\") ? "\\" : "/";
        const pathParts = filePath.split(pathSeparator);

        const fileName = pathParts[pathParts.length - 1];
        const fileDirname = pathParts.length > 1 ? pathParts[pathParts.length - 2] : "";

        return {
            name: fileName,
            dirName: fileDirname,
            path: filePath
        };
    }

    /**
     * Returns a jQuery object containing the file icon for a given file
     *
     * @param {Object} fileData - The file data object
     * @returns {jQuery} jQuery object containing the file icon
     */
    function getFileIcon(fileData) {
        const $link = $("<a href='#' class='mroitem'></a>").html(
            ViewUtils.getFileEntryDisplay({ name: fileData.name })
        );
        WorkingSetView.useIconProviders(
            {
                fullPath: fileData.path,
                name: fileData.name,
                isFile: true
            },
            $link
        );
        return $link.children().first();
    }

    function getBookmarkSVGIcon() {
        const iconPath = ExtensionUtils.getModulePath(module, "../assets/bookmark.svg");

        // create the bookmark icon HTML using the SVG file
        const bookmarkIcon = `<img src="${iconPath}" style="filter: brightness(1) invert(1);"/>`;

        return bookmarkIcon;
    }

    /**
     * This function is responsible to just change the dropdown icon
     * @private
     * @param {JQuery} $fileDropdownIcon - the file dropdown div
     */
    function _changeDropdownIcon($fileDropdownIcon) {
        $fileDropdownIcon[0].classList.toggle("fa-chevron-right");
        $fileDropdownIcon[0].classList.toggle("fa-chevron-down");
    }

    /**
     * This function gets triggered when the dropdown icon in the file header gets clicked
     * it is to show/hide the bookmarks for that file
     * @param {Event} e - the event
     */
    function fileDropdownClicked(e) {
        e.stopPropagation();

        const $fileDropdownElement = $(e.target).closest(".file-dropdown");
        const $fileDropdownIcon = $fileDropdownElement.find("i");
        const $bookmarkFileHeader = $fileDropdownElement.closest(".bookmark-file-header");
        const $bookmarkFileItems = $bookmarkFileHeader.siblings(".bookmarked-lines");

        _changeDropdownIcon($fileDropdownIcon);
        $bookmarkFileItems.toggleClass("hidden");
    }

    /**
     * This function gets triggered when the clear (trash bin) icon in the file header gets clicked
     * it deletes all the bookmarks for that particular file
     * @param {Event} e - the event
     */
    function fileClearBtnClicked(e) {
        e.stopPropagation();
        try {
            const filePath = $(e.target).closest(".file-clear").siblings(".file-path")[0].innerText;
            if (filePath) {
                delete Globals.BookmarksList[filePath];
                Preferences.saveBookmarksToState();
            }
        } catch {
            console.error("something went wrong when trying to delete bookmarks");
            return;
        }
    }

    /**
     * This function gets triggered when the user tries to delete a specific bookmark by clicking on the 'times' button
     * it deletes that particular bookmark
     * @param {Event} e - the event
     */
    function fileDeleteBtnClicked(e) {
        e.stopPropagation();

        try {
            // get the file path from DOM
            const filePath = $(e.target)
                .closest(".bookmarked-lines")
                .siblings(".bookmark-file-header")
                .find(".file-path")[0].innerText;
            const lineNumberElement = $(e.target).closest(".delete-bookmark").siblings(".line-number")[0].innerText;

            // we need to do this because lineNumberElement is in the format "ln: 33"
            // 33 is just an example. we need to fetch the actual number from the string
            const lineNumber = parseInt(lineNumberElement.match(/\d+/)[0], 10);

            if (filePath && lineNumber) {
                BookmarksList.removeLineFromBookmarks(filePath, lineNumber - 1);
            }
        } catch {
            console.error("something went wrong when trying to delete bookmark");
            return;
        }
    }

    exports.getBookmarkSVGIcon = getBookmarkSVGIcon;
    exports.getLineContent = getLineContent;
    exports.getFilePathData = getFilePathData;
    exports.getFileIcon = getFileIcon;
    exports.fileDropdownClicked = fileDropdownClicked;
    exports.fileClearBtnClicked = fileClearBtnClicked;
    exports.fileDeleteBtnClicked = fileDeleteBtnClicked;
});
