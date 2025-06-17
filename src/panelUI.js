/*
 * This file holds all the code i.e. related to creating the bookmarks panel UI from the bookmarks list and all that
 */

define(function (require, exports, module) {
    const PanelHelper = require("./panelHelper");

    // the bookmark SVG icon that is displayed in the panel bookmarks list (at the left side of each bookmarked line)
    const $BookmarkSVGIcon = PanelHelper.getBookmarkSVGIcon();

    /**
     * This function is responsible to create the elements for each bookmark inside a file
     *
     * @param {Array} fileBookmarkList - the list of all the bookmarked line numbers
     * @param {String} filePath - the file path
     * @param {HTMLElement} $bookmarkItem - the bookmarked item, we need this because we wanna append the bookmarked lines element inside it
     */
    async function _createFileBookmarksListUI(fileBookmarkList, filePath, $bookmarkItem) {
        // There can be many bookmarked-line...all of them will be appended inside this
        // NOTE: Don't get confused in the name: this is bookmarked-line'S' not bookmarked-line
        const $bookmarkedLines = $("<div>").addClass("bookmarked-lines");

        for (let i = 0; i < fileBookmarkList.length; i++) {
            const $bookmarkedLine = $("<div>").addClass("bookmarked-line");

            const $bookmarkIcon = $("<div>").addClass("bookmark-icon").html($BookmarkSVGIcon);
            const $lineNumber = $("<div>")
                .addClass("line-number")
                .text(`Ln ${fileBookmarkList[i] + 1}`);

            // Get the line content asynchronously
            const lineContent = await PanelHelper.getLineContent(filePath, fileBookmarkList[i]);
            const $lineContent = $("<div>").addClass("line-content").text(lineContent);

            const $deleteBookmark = $("<div>").addClass("delete-bookmark").html(`<i class="fas fa-times"></i>`);

            $deleteBookmark.on("click", PanelHelper.fileDeleteBtnClicked);

            $bookmarkedLine.append($bookmarkIcon);
            $bookmarkedLine.append($lineNumber);
            $bookmarkedLine.append($lineContent);
            $bookmarkedLine.append($deleteBookmark);

            $bookmarkedLines.append($bookmarkedLine);
        }

        $bookmarkItem.append($bookmarkedLines);
    }

    /**
     * This function is the main function which holds all the code to create the bookmarks UI that is to be displayed when the bookmarks icon in the toolbar is clicked
     * It creates all the required HTML elements, fills all the necessary data inside them and displays it
     *
     * @param {Object} bookmarksList - the main bookmarks list object which has the filePaths and all the bookmarked line no.s
     */
    async function createBookmarksUI(bookmarksList) {
        // this is the main bookmarks wrapper inside it all the panel bookmarks stuff will come
        const $bookmarksWrapper = $("#bookmarks-wrapper");
        $bookmarksWrapper.empty(); // just clear it, as we're remaking it

        // Process each file sequentially to maintain order
        for (let filePath in bookmarksList) {
            const fileBookmarkList = bookmarksList[filePath];

            // make sure there are bookmarked lines in the file
            if (fileBookmarkList.length === 0) {
                continue;
            }

            const fileData = PanelHelper.getFilePathData(filePath);
            const $fileIconElement = PanelHelper.getFileIcon(fileData);

            const $bookmarkItem = $("<div>").addClass("bookmark-item");

            // all the file heading items will be appended inside this
            const $bookmarkFileHeader = $("<div>").addClass("bookmark-file-header");

            // the file heading items
            const $fileDropdown = $("<div>").addClass("file-dropdown").html(`<i class="fas fa-chevron-right"></i>`);

            // this will always be hidden. then why do we need this
            // the reason is when we want to delete a bookmark, we want to fetch the exact file for which we want to delete
            // so we can get the closest 'file-path' when a delete/trash button is clicked
            const $filePath = $("<div>").addClass("file-path").text(filePath);
            $filePath.css("display", "none");

            const $fileIcon = $("<div>").addClass("file-icon").html($fileIconElement);
            const $fileName = $("<div>").addClass("file-name").text(fileData.name);
            const $fileDirname = $("<div>").addClass("file-dirname").text(fileData.dirName);
            const $fileClear = $("<div>").addClass("file-clear").html(`<i class="fas fa-trash"></i>`);

            // add click handlers
            $fileDropdown.on("click", PanelHelper.fileDropdownClicked);
            $fileClear.on("click", PanelHelper.fileClearBtnClicked);

            // append all that to bookmarkFileHeader
            $bookmarkFileHeader.append($fileDropdown);
            $bookmarkFileHeader.append($filePath);
            $bookmarkFileHeader.append($fileIcon);
            $bookmarkFileHeader.append($fileName);
            $bookmarkFileHeader.append($fileDirname);
            $bookmarkFileHeader.append($fileClear);

            // append the file header to the bookmark item
            $bookmarkItem.append($bookmarkFileHeader);

            // create and append the bookmarked lines to this bookmark item (await the async function)
            await _createFileBookmarksListUI(fileBookmarkList, filePath, $bookmarkItem);

            // finally append the complete bookmark item to the wrapper
            $bookmarksWrapper.append($bookmarkItem);
        }
    }

    exports.createBookmarksUI = createBookmarksUI;
});
