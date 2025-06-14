/*
 * This file holds all the code i.e. related to creating the bookmarks panel UI from the bookmarks list and all that
 */

define(function (require, exports, module) {
    const ViewUtils = brackets.getModule("utils/ViewUtils");
    const WorkingSetView = brackets.getModule("project/WorkingSetView");

    function _getFilePathData(filePath) {
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
    function _getFileIcon(fileData) {
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

    function _fileDropdownClicked(e) {
        e.stopPropagation();
    }

    function _fileClearBtnClicked(e) {
        e.stopPropagation();
    }

    function _createFileBookmarksListUI(fileBookmarkList, filePath, $bookmarkItem) {
        const $bookmarkedLines = $("<div>").addClass("bookmarked-lines");

        for (let i = 0; i < fileBookmarkList.length; i++) {
            const $bookmarkedLine = $("<div>").addClass("bookmarked-line");

            const $bookmarkIcon = $("<div>").addClass("bookmark-icon").text("box");
            const $lineNumber = $("<div>").addClass("line-number").text(fileBookmarkList[i] + 1);
            const $lineContent = $("<div>").addClass("line-content").text("function hello() {");
            const $deleteBookmark = $("<div>").addClass("delete-bookmark").html(`<i class="fas fa-times"></i>`);

            $bookmarkedLine.append($bookmarkIcon);
            $bookmarkedLine.append($lineNumber);
            $bookmarkedLine.append($lineContent);
            $bookmarkedLine.append($deleteBookmark);

            $bookmarkedLines.append($bookmarkedLine);
        }

        $bookmarkItem.append($bookmarkedLines);
    }

    function createBookmarksUI(bookmarksList) {
        const $bookmarksWrapper = $("#bookmarks-wrapper");
        $bookmarksWrapper.empty();

        for (let filePath in bookmarksList) {
            const fileBookmarkList = bookmarksList[filePath];

            if (fileBookmarkList.length === 0) {
                continue;
            }

            const fileData = _getFilePathData(filePath);
            const $fileIconElement = _getFileIcon(fileData);

            // all the file heading items will be appended inside this
            const $bookmarkItem = $("<div>").addClass("bookmark-item");

            const $bookmarkFileHeader = $("<div>").addClass("bookmark-file-header");

            // the file heading items
            const $fileDropdown = $("<div>").addClass("file-dropdown").html(`<i class="fas fa-chevron-right"></i>`);
            const $fileIcon = $("<div>").addClass("file-icon").html($fileIconElement);
            const $fileName = $("<div>").addClass("file-name").text(fileData.name);
            const $fileDirname = $("<div>").addClass("file-dirname").text(fileData.dirName);
            const $fileClear = $("<div>").addClass("file-clear").html(`<i class="fas fa-trash"></i>`);

            // add click handler
            $fileDropdown.on("click", _fileDropdownClicked);
            $fileClear.on("click", _fileClearBtnClicked);

            // append all that to bookmarkFileHeader
            $bookmarkFileHeader.append($fileDropdown);
            $bookmarkFileHeader.append($fileIcon);
            $bookmarkFileHeader.append($fileName);
            $bookmarkFileHeader.append($fileDirname);
            $bookmarkFileHeader.append($fileClear);

            // append the file header to the bookmark item
            $bookmarkItem.append($bookmarkFileHeader);

            // create and append the bookmarked lines to this bookmark item
            _createFileBookmarksListUI(fileBookmarkList, filePath,$bookmarkItem);

            // finally append the complete bookmark item to the wrapper
            $bookmarksWrapper.append($bookmarkItem);
        }
    }

    exports.createBookmarksUI = createBookmarksUI;
});
