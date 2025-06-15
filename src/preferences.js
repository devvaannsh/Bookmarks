define(function (require, exports, module) {
    const PreferencesManager = brackets.getModule("preferences/PreferencesManager");

    const Globals = require("./globals");

    // create extension preferences
    const prefs = PreferencesManager.getExtensionPrefs("Boomarks");

    // define preference for storing bookmarks
    prefs.definePreference(
        "bookmarksList",
        "Object",
        {},
        {
            description: "List of the bookmarked lines in files"
        }
    );

    /**
     * Load bookmarks from preferences
     * This is called on startup to restore previously saved bookmarks
     */
    function loadBookmarksFromState() {
        try {
            const savedBookmarks = prefs.get("bookmarksList");
            Globals.BookmarksList = savedBookmarks;
        } catch (e) {
            console.error("something went wrong when trying to load bookmarks from preferences:", e);
        }
    }

    /**
     * Save bookmarks to preferences
     * This is called whenever bookmarks are modified
     */
    function saveBookmarksToState() {
        try {
            prefs.set("bookmarksList", Globals.BookmarksList);
        } catch (e) {
            console.error("something went wrong when saving bookmarks to preferences:", e);
        }
    }

    exports.loadBookmarksFromState = loadBookmarksFromState;
    exports.saveBookmarksToState = saveBookmarksToState;
});
