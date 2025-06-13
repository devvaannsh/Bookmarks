/*
 * This script all the stuff related to the bookmarks panel
 * like showing/hiding the panel when the toolbar bookmark icon is clicked
 * showing all the content inside it and all other stuff
 * The HTML for the bookmarks panel is written inside '../htmlContent/panel.html'
 * and the styles is written inside '../styles/panel.less'
 */

define(function (require, exports, module) {
    const WorkspaceManager = brackets.getModule("view/WorkspaceManager");

    const panelHtml = require("text!../htmlContent/panel.html");

    const BOOKMARKS_PANEL_ID = "bookmarks.panel";
    let BookmarksPanel = null; // this will hold the panel reference

    /**
     * This function is called when the bookmarks toolbar icon is clicked for the first time
     * and the panel is not yet created
     */
    function _createBookmarksPanel() {
        BookmarksPanel = WorkspaceManager.createPluginPanel(BOOKMARKS_PANEL_ID, $(panelHtml), 200, $(), 400);
        BookmarksPanel.show();
    }

    /**
     * This function is called inside the '../main.js' when the bookmark toolbar icon is clicked
     * it is used to show/hide the panel
     */
    function toggleBookmarksPanel() {
        if (!BookmarksPanel) { // if the panel is not yet created even once, create it
            _createBookmarksPanel();
        } else { // else we just want to toggle the visibility
            if (BookmarksPanel.isVisible()) {
                BookmarksPanel.hide();
            } else {
                BookmarksPanel.show();
            }
        }
    }

    exports.toggleBookmarksPanel = toggleBookmarksPanel;
});
