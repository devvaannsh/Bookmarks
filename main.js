define(function (require, exports, module) {
    const AppInit = brackets.getModule("utils/AppInit");
    const CommandManager = brackets.getModule("command/CommandManager");
    const Menus = brackets.getModule("command/Menus");
    const ExtensionUtils = brackets.getModule("utils/ExtensionUtils");
    const Editor = brackets.getModule("editor/Editor").Editor;

    const Bookmarks = require("./src/bookmarks");
    const Globals = require("./src/globals");
    ExtensionUtils.loadStyleSheet(module, "styles/style.less");

    // gutter related stuff
    const GUTTER_NAME = Globals.GUTTER_NAME;
    const BOOKMARK_GUTTER_PRIORITY = Globals.BOOKMARK_GUTTER_PRIORITY;
    // initialize the bookmark gutter
    Editor.registerGutter(GUTTER_NAME, BOOKMARK_GUTTER_PRIORITY);

    // command ids
    const CMD_BOOKMARK_SUBMENU_ID = "bookmarks-submenu-id";
    const CMD_TOGGLE_BOOKMARK = "bookmarks.toggleBookmark";
    const CMD_NEXT_BOOKMARK = "bookmarks.nextBookmark";
    const CMD_PREV_BOOKMARK = "bookmarks.prevBookmark";

    const Strings = {
        TOGGLE_BOOKMARK: "Toggle Bookmark",
        GOTO_NEXT_BOOKMARK: "Go to Next Bookmark",
        GOTO_PREV_BOOKMARK: "Go to Previous Bookmark",
        BOOKMARK_SUBMENU: "Bookmarks"
    };

    // default keyboard shortcuts
    const TOGGLE_BOOKMARK_KB_SHORTCUT = "Ctrl-Alt-B";
    const NEXT_BOOKMARK_KB_SHORTCUT = "Ctrl-Alt-N";
    const PREV_BOOKMARK_KB_SHORTCUT = "Ctrl-Alt-P";

    /**
     * This function is responsible for registering all the required commands
     */
    function _registerCommands() {
        CommandManager.register(Strings.TOGGLE_BOOKMARK, CMD_TOGGLE_BOOKMARK, Bookmarks.toggleBookmark);
        CommandManager.register(Strings.GOTO_NEXT_BOOKMARK, CMD_NEXT_BOOKMARK, Bookmarks.goToNextBookmark);
        CommandManager.register(Strings.GOTO_PREV_BOOKMARK, CMD_PREV_BOOKMARK, Bookmarks.goToPrevBookmark);
    }

    /**
     * This function is responsible to add the bookmarks menu items to the navigate menu
     */
    function _addItemsToMenu() {
        const navigateMenu = Menus.getMenu(Menus.AppMenuBar.NAVIGATE_MENU);
        navigateMenu.addMenuDivider(); // add a line to separate the other items from the bookmark ones

        navigateMenu.addMenuItem(CMD_TOGGLE_BOOKMARK, TOGGLE_BOOKMARK_KB_SHORTCUT);
        navigateMenu.addMenuItem(CMD_NEXT_BOOKMARK, NEXT_BOOKMARK_KB_SHORTCUT);
        navigateMenu.addMenuItem(CMD_PREV_BOOKMARK, PREV_BOOKMARK_KB_SHORTCUT);
    }

    /**
     * This function is responsible to add the bookmarks menu items to the context menu (that appears when user right click on the editor)
     */
    function _addItemsToContextMenu() {
        const subMenu = Menus.getContextMenu(Menus.ContextMenuIds.EDITOR_MENU).addSubMenu(
            Strings.BOOKMARK_SUBMENU,
            CMD_BOOKMARK_SUBMENU_ID
        );

        subMenu.addMenuItem(CMD_TOGGLE_BOOKMARK);
        subMenu.addMenuItem(CMD_NEXT_BOOKMARK);
        subMenu.addMenuItem(CMD_PREV_BOOKMARK);
    }

    function init() {
        _registerCommands();
        _addItemsToMenu();
        _addItemsToContextMenu();
    }

    AppInit.appReady(function () {
        init();
    });
});
