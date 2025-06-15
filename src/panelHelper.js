/*
 * This fils holds the utility functions that the panelUI file needs
 */

define(function (require, exports, module) {
    const ViewUtils = brackets.getModule("utils/ViewUtils");
    const WorkingSetView = brackets.getModule("project/WorkingSetView");
    const FileSystem = brackets.getModule("filesystem/FileSystem");
    const DocumentManager = brackets.getModule("document/DocumentManager");


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

    /**
     * This function gets triggered when the dropdown icon in the file header gets clicked
     * it is to show/hide the bookmarks for that file
     * @param {Event} e - the event
     */
    function fileDropdownClicked(e) {
        e.stopPropagation();
    }

    /**
     * This function gets triggered when the clear (trash bin) icon in the file header gets clicked
     * it deletes all the bookmarks for that particular file
     * @param {Event} e - the event
     */
    function fileClearBtnClicked(e) {
        e.stopPropagation();
    }

    exports.getLineContent = getLineContent;
    exports.getFilePathData = getFilePathData;
    exports.getFileIcon = getFileIcon;
    exports.fileDropdownClicked = fileDropdownClicked;
    exports.fileClearBtnClicked = fileClearBtnClicked;
});
