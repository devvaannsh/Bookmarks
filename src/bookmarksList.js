/*
 * This file handles all the bookmarksList related stuff
 * like storing the bookmarksList in an object in the manner {filePath1: [...], filePath2: [...]}
 * and related functions to work with bookmarksList like adding a new line to bookmarks list or removing, etc
 */

define(function (require, exports, module) {
    const Globals = require("./globals");
    const Preferences = require("./preferences");

    const GUTTER_NAME = Globals.GUTTER_NAME;

    /**
     * getter function: returns the bookmarks list
     *
     * @param {String | null} filePath - pass the filePath if we need to see the list of all the bookmarked lines for that file, or leave it if we want to see the whole bookmarksList Object
     * @returns {Array | Object} - returns whole bookmarksList object if no filePath is provided otherwise an array of all the bookmarked lines for that particular file
     */
    function getBookmarksList(filePath = null) {
        if (!filePath) {
            return Globals.BookmarksList;
        } else {
            return Globals.BookmarksList[filePath];
        }
    }

    /**
     * To sort the bookmarked lines array for a particular file
     * This is important so that goToNextBookmark/goToPrevBookmark works as expected
     *
     * @param {String} filePath - to get the array list for that specific file
     */
    function _sortBookmarkedLinesForFile(filePath) {
        Globals.BookmarksList[filePath].sort((a, b) => a - b);
    }

    /**
     * This function is called when we want to add a line to the bookmarks list
     * it is called inside the `toggleBookmark` function inside ./bookmarks.js
     *
     * @param {String} filePath - to add the line number on the list of that particular file
     * @param {Number} line - the line number to add
     * @param {Boolean} noSort - sometimes we call this function internally to just refresh the bookmarks list as per the UI, to make sure that the Bookmarks list line numbers remains consistent to the UI. (Didn't understand: read the `updateBookmarksAsPerUI` function's jsdoc)...so when noSort is true, we don't call the `_sortBookmarkedLinesForFile` because it is already coming in a sorted manner as we are traversing the whole file from top to bottom, so to prevent function overheads and make it efficient, we pass true to noSort, this defaults to false.
     */
    function addLineToBookmarks(filePath, line, noSort = false) {
        if (!Globals.BookmarksList[filePath]) {
            // if filePath is not present, add it
            Globals.BookmarksList[filePath] = [line];
        } else {
            if (!Globals.BookmarksList[filePath].includes(line)) {
                // make sure that line is not already in the bookmarks list
                Globals.BookmarksList[filePath].push(line);
                if (!noSort) {
                    _sortBookmarkedLinesForFile(filePath); // this is important so that go to next/prev works as expected
                }
            }
        }
        Preferences.saveBookmarksToState();
    }

    /**
     * This function is called when we want to remove a line from the bookmarks list
     * it is called inside the `toggleBookmark` function inside ./bookmarks.js
     *
     * @param {String} filePath - to remove the line number from the list of that particular file
     * @param {Number} line - the line number to remove
     */
    function removeLineFromBookmarks(filePath, line) {
        const lines = Globals.BookmarksList[filePath];

        if (lines) {
            const index = lines.indexOf(line);
            if (index !== -1) {
                lines.splice(index, 1); // remove the line from the array

                if (lines.length === 0) {
                    // clean up file paths if no more lines are present
                    delete Globals.BookmarksList[filePath];
                }
            }
        }
        Preferences.saveBookmarksToState();
    }

    /**
     * This function is needed because lets say: user created a bookmark on an empty line (lets say line 13) and then pressed enter, then codemirror moves the whole gutter below, so our bookmark icon will now be at line 14. But in our bookmarksList, it is still line 13 because that's where it was originally created. BookmarksList doesn't know that codemirror moved it below.
     * So, now when the user clicks on lets say (go to next bookmark) expecting that it will move the cursor to line 14 (where the bookmark icon is), but it instead moves to line 13. So, when user hits the go to next/prev bookmark,
     * we update the bookmarks list as per the UI so that it remains consistent.
     *
     * @param {Editor} editor - the editor instance
     * @param {String} filePath - the current opened editor file, because we want to update the bookmarks for this file
     */
    function updateBookmarksAsPerUI(editor, filePath) {
        // empty all the current bookmarks for the file path
        Globals.BookmarksList[filePath] = [];

        const lineCount = editor.lineCount();

        // traverse the whole file top -> bottom, searching for bookmarks icon in the gutter, if present add the line number to the list
        for (let line = 0; line < lineCount; line++) {
            const lineHasBookmarkIcon = !!editor.getGutterMarker(line, GUTTER_NAME);

            if (lineHasBookmarkIcon) {
                addLineToBookmarks(filePath, line, true); // 3rd para is for noSorting...read the `addLineToBookmarks` function's jsdoc
            }
        }
        Preferences.saveBookmarksToState();
    }

    exports.getBookmarksList = getBookmarksList;
    exports.addLineToBookmarks = addLineToBookmarks;
    exports.removeLineFromBookmarks = removeLineFromBookmarks;
    exports.updateBookmarksAsPerUI = updateBookmarksAsPerUI;
});
