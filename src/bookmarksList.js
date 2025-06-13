/*
 * This file handles all the bookmarksList related stuff
 * like storing the bookmarksList in an object in the manner {filePath1: [...], filePath2: [...]}
 * and related functions to work with bookmarksList like adding a new line to bookmarks list or removing, etc
 */

define(function (require, exports, module) {
    /**
     * This is an object that will store all the list of the bookmarks
     * The filePath will be the key and its value will be an array which will have all the line numbers where bookmarks are present
     * For ex: {
        Bookmarks/src/main: [10, 20, 21, 24, 199],
        Bookmarks/src/bookmarks: [2, 5]
     }
     */
    const BookmarksList = {};

    /**
     * getter function: returns the bookmarks list
     *
     * @param {String | null} filePath - pass the filePath if we need to see the list of all the bookmarked lines for that file, or leave it if we want to see the whole bookmarksList Object
     * @returns {Array | Object} - returns whole bookmarksList object if no filePath is provided otherwise an array of all the bookmarked lines for that particular file
     */
    function getBookmarksList(filePath = null) {
        if (!filePath) {
            return BookmarksList;
        } else {
            return BookmarksList[filePath];
        }
    }

    /**
     * To sort the bookmarked lines array for a particular file
     * This is important so that goToNextBookmark/goToPrevBookmark works as expected
     *
     * @param {String} filePath - to get the array list for that specific file
     */
    function _sortBookmarkedLinesForFile(filePath) {
        BookmarksList[filePath].sort((a, b) => a - b);
    }

    /**
     * This function is called when we want to add a line to the bookmarks list
     * it is called inside the `toggleBookmark` function inside ./bookmarks.js
     *
     * @param {String} filePath - to add the line number on the list of that particular file
     * @param {Number} line - the line number to add
     */
    function addLineToBookmarks(filePath, line) {
        if (!BookmarksList[filePath]) {
            // if filePath is not present, add it
            BookmarksList[filePath] = [line];
        } else {
            if (!BookmarksList[filePath].includes(line)) {
                // make sure that line is not already in the bookmarks list
                BookmarksList[filePath].push(line);
                _sortBookmarkedLinesForFile(filePath); // this is important so that go to next/prev works as expected
            }
        }
    }

    /**
     * This function is called when we want to remove a line from the bookmarks list
     * it is called inside the `toggleBookmark` function inside ./bookmarks.js
     *
     * @param {String} filePath - to remove the line number from the list of that particular file
     * @param {Number} line - the line number to remove
     */
    function removeLineFromBookmarks(filePath, line) {
        const lines = BookmarksList[filePath];

        if (lines) {
            const index = lines.indexOf(line);
            if (index !== -1) {
                lines.splice(index, 1); // remove the line from the array

                if (lines.length === 0) {
                    // clean up file paths if no more lines are present
                    delete BookmarksList[filePath];
                }
            }
        }
    }

    exports.getBookmarksList = getBookmarksList;
    exports.addLineToBookmarks = addLineToBookmarks;
    exports.removeLineFromBookmarks = removeLineFromBookmarks;
});
