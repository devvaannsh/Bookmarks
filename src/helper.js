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

    /**
     * This function is to show the 'No bookmarks added yet' message
     * and hide the bookmarks wrapper
     */
    function showNoBookmarksMessage() {
        const $noBookmarksMessage = $("#no-bookmarks-wrapper");
        const $bookmarksMessage = $("#bookmarks-wrapper");

        $noBookmarksMessage.removeClass("hidden");
        $bookmarksMessage.addClass("hidden");
    }

    /**
     * This function is to show the bookmarks wrapper
     * and hide the 'no bookmarks message'
     */
    function hideNoBookmarksMessage() {
        const $noBookmarksMessage = $("#no-bookmarks-wrapper");
        const $bookmarksMessage = $("#bookmarks-wrapper");

        $noBookmarksMessage.addClass("hidden");
        $bookmarksMessage.removeClass("hidden");
    }

    exports.createBookmarkMarker = createBookmarkMarker;
    exports.showNoBookmarksMessage = showNoBookmarksMessage;
    exports.hideNoBookmarksMessage = hideNoBookmarksMessage;
});
