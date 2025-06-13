define(function (require, exports, module) {
    // the bookmark svg icon
    const bookmarkSvg = require("text!assets/bookmark.svg");

    /**
     * This function creates a bookmark marker element
     *
     * @returns {HTMLElement} The bookmark marker element
     */
    function createBookmarkMarker() {
        return $("<div>").addClass("bookmark-icon").html(bookmarkSvg)[0];
    }

    exports.createBookmarkMarker = createBookmarkMarker;
});
