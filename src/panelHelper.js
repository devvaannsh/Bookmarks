/*
 * This fils holds the utility functions that the panelUI file needs
 */

define(function (require, exports, module) {
    const ViewUtils = brackets.getModule("utils/ViewUtils");
    const WorkingSetView = brackets.getModule("project/WorkingSetView");

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

    exports.getFilePathData = getFilePathData;
    exports.getFileIcon = getFileIcon;
    exports.fileDropdownClicked = fileDropdownClicked;
    exports.fileClearBtnClicked = fileClearBtnClicked;
});
