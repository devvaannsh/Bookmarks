/*
 * This file handles all the bookmark UI related functionality,
 * like toggling the bookmark (also calls the required function to add that to BookmarksList, but that is not implemented in this file)
 * moving to next/prev bookmarks...
 */
define(function (require, exports, module) {
    const EditorManager = brackets.getModule("editor/EditorManager");

    const Globals = require("./globals");
    const Helper = require("./helper");
    const BookmarksList = require("./bookmarksList");

    const GUTTER_NAME = Globals.GUTTER_NAME;

    /**
     * This function gets called when user clicks on the toggle bookmark button
     * it checks if the line has bookmark or not, if it does it removes it otherwise adds it
     * it also calls the required functions to add/remove the bookmarked line from the bookmarksList (refer to ./bookmarksList.js)
     */
    function toggleBookmark() {
        const editor = EditorManager.getFocusedEditor();
        if (!editor) {
            return;
        }

        const filePath = editor.document.file.fullPath;
        const line = editor.getCursorPos().line;

        // true if it has bookmark icon, otherwise false
        const lineHasBookmarkIcon = !!editor.getGutterMarker(line, GUTTER_NAME);

        if (lineHasBookmarkIcon) {
            // remove the bookmark icon
            editor.setGutterMarker(line, GUTTER_NAME, "");
            BookmarksList.removeLineFromBookmarks(filePath, line);
        } else {
            // add the bookmark icon
            editor.setGutterMarker(line, GUTTER_NAME, Helper.createBookmarkMarker());
            BookmarksList.addLineToBookmarks(filePath, line);
        }
    }

    /**
     * This function gets called when user clicks on the 'go to next bookmark' button
     * it gets all the bookmarks for the current file from the BookmarksList
     * then it finds the closest (bigger) lineNumber from the current cursor line
     * if none is present, we move to the first bookmark in the file
     */
    function goToNextBookmark() {
        const editor = EditorManager.getFocusedEditor();
        if (!editor) {
            return;
        }

        const filePath = editor.document.file.fullPath;
        const currLine = editor.getCursorPos().line;

        if (!filePath || !currLine) {
            return;
        }

        // read the function's jsdoc to understand why we need this
        BookmarksList.updateBookmarksAsPerUI(editor, filePath);

        // a list of all the bookmarked lines for this current file
        const bookmarkedLines = BookmarksList.getBookmarksList(filePath);

        if (bookmarkedLines.length === 0) {
            return;
        }

        // [Number] this will hold the line number where the next bookmark is present
        let nextBookmark = null;

        // search for the next bookmark
        for (let i = 0; i < bookmarkedLines.length; i++) {
            if (bookmarkedLines[i] > currLine) {
                nextBookmark = bookmarkedLines[i];
                break;
            }
        }

        // if no next bookmark is present, we move to the first bookmark in the file
        if (!nextBookmark) {
            nextBookmark = bookmarkedLines[0];
        }

        editor.setCursorPos(nextBookmark, 0);
    }

    /**
     * This function gets called when user clicks on the 'go to prev bookmark' button
     * it gets all the bookmarks for the current file from the BookmarksList
     * then it finds the closest (smaller) lineNumber from the current cursor line
     * if none is present, we move to the last bookmark in the file
     */
    function goToPrevBookmark() {
        const editor = EditorManager.getFocusedEditor();
        if (!editor) {
            return;
        }

        const filePath = editor.document.file.fullPath;
        const currLine = editor.getCursorPos().line;

        if (!filePath || !currLine) {
            return;
        }

        // read the function's jsdoc to understand why we need this
        BookmarksList.updateBookmarksAsPerUI(editor, filePath);

        // a list of all the bookmarked lines for this current file
        const bookmarkedLines = BookmarksList.getBookmarksList(filePath);

        if (bookmarkedLines.length === 0) {
            return;
        }

        // [Number] this will hold the line number where the prev bookmark is present
        let prevBookmark = null;

        // search for the prev bookmark
        for (let i = bookmarkedLines.length - 1; i >= 0; i--) {
            if (bookmarkedLines[i] < currLine) {
                prevBookmark = bookmarkedLines[i];
                break;
            }
        }

        // if no prev bookmark is present, we move to the last bookmark in the file
        if (!prevBookmark) {
            prevBookmark = bookmarkedLines[bookmarkedLines.length - 1];
        }

        editor.setCursorPos(prevBookmark, 0);
    }

    /**
     * This function is to update the UI as per the bookmarks list
     * Here is why it is needed, when we load the bookmarksList from preferences, then the list is set
     * but we bookmarks icon is not visible in the gutter yet
     * So what we do is whenever any editor is opened, we just check if it has bookmarks, if it does, we display the bookmarks
     *
     * @param {Editor} editor - the editor instance
     */
    function updateUIasPerBookmarksList(editor) {
        const filePath = editor.document.file.fullPath;
        if (!filePath) {
            return;
        }

        // a list of all the bookmarked lines for this current file
        const bookmarkedLines = BookmarksList.getBookmarksList(filePath);

        if (bookmarkedLines.length === 0) {
            return;
        }

        for (let i = 0; i < bookmarkedLines.length; i++) {
            const line = bookmarkedLines[i];
            editor.setGutterMarker(line, GUTTER_NAME, Helper.createBookmarkMarker());
        }
    }

    exports.toggleBookmark = toggleBookmark;
    exports.goToNextBookmark = goToNextBookmark;
    exports.goToPrevBookmark = goToPrevBookmark;
    exports.updateUIasPerBookmarksList = updateUIasPerBookmarksList;
});
