define(function (require, exports, module) {
    const GUTTER_NAME = "CodeMirror-bookmarkGutter";
    const BOOKMARK_GUTTER_PRIORITY = 10;

    /**
     * This is an object that will store all the list of the bookmarks
     * The filePath will be the key and its value will be an array which will have all the line numbers where bookmarks are present
     * For ex: {
        Bookmarks/src/main: [10, 20, 21, 24, 199],
        Bookmarks/src/bookmarks: [2, 5]
     }
     */
    let BookmarksList = {};

    exports.BookmarksList = BookmarksList;
    exports.GUTTER_NAME = GUTTER_NAME;
    exports.BOOKMARK_GUTTER_PRIORITY = BOOKMARK_GUTTER_PRIORITY;
});
