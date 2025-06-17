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
            // we need to format the bookmarks list before saving to state
            // because in the prefs we display it as 1-based but the original bookmarks list expects it to be 0-based
            const formattedBookmarksList = {};
            for (let filePath in savedBookmarks) {
                const originalLineNumbers = savedBookmarks[filePath];
                const adjustedLineNumbers = originalLineNumbers.map((n) => n - 1);
                formattedBookmarksList[filePath] = adjustedLineNumbers;
            }
            Globals.BookmarksList = formattedBookmarksList;
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
            // we need to format the bookmarks list before saving to state
            // because the original bookmarks list store line numbers as 0-based, but in the prefs we want to display it as 1-based
            const formattedBookmarksList = {};
            for (let filePath in Globals.BookmarksList) {
                const originalLineNumbers = Globals.BookmarksList[filePath];
                const adjustedLineNumbers = originalLineNumbers.map((n) => n + 1);
                formattedBookmarksList[filePath] = adjustedLineNumbers;
            }
            prefs.set("bookmarksList", formattedBookmarksList);
        } catch (e) {
            console.error("something went wrong when saving bookmarks to preferences:", e);
        }
    }

    exports.loadBookmarksFromState = loadBookmarksFromState;
    exports.saveBookmarksToState = saveBookmarksToState;
});
