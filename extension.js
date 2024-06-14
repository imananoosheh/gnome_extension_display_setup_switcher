const { St, Gio, GObject } = imports.gi;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const Util = imports.misc.util;
const PopupMenu = imports.ui.popupMenu;

/**
* imports.gi: Provides access to GNOME libraries like GLib, GObject, and St (Shell Toolkit).
* imports.ui.main: Provides access to the main GNOME UI elements.
* imports.ui.panelMenu: Helps in creating custom panel menu items.
* imports.misc.util: Provides utility functions like spawning processes.
* imports.ui.popupMenu: Helps in creating popup menu items.
 */

/**
 * GObject:
 * GObject is the base object system used in GNOME. It allows the creation of classes and objects in a way that integrates with the GNOME framework.
 */
//  Registers the class with GObject, allowing it to be used in the GNOME environment.
const DisplaySwitcher = GObject.registerClass(
class DisplaySwitcher extends PanelMenu.Button {
    _init() {
        //  Call the constructor of the parent class.
        //  '0.0' means the button will be placed at the beginning (leftmost position) of the status area in the top panel.
        super._init(0.0, 'Display Setup Switcher');

        log('Initializing Display Setup Switcher extension');

        // Create the main button in the top bar
        let icon = new St.Icon({ icon_name: 'preferences-desktop-display-symbolic', style_class: 'system-status-icon' });
        this.add_child(icon);

        // Create a menu item for Game On
        let gameOnItem = new PopupMenu.PopupMenuItem('Game On');
        gameOnItem.connect('activate', () => {
            log('Game ON pressed');
            try {
                Util.spawn(['sh', '-c', 'xrandr --output DP-1-0.8 --off --output DP-1-0.9 --primary --mode 1920x1080 --rate 75 --pos 0x0 --rotate normal']);
            } catch (e) {
                logError(e, 'Failed to run command for Game ON');
            }
        });
        this.menu.addMenuItem(gameOnItem);

        // Create a menu item for Game Off
        let gameOffItem = new PopupMenu.PopupMenuItem('Game Off');
        gameOffItem.connect('activate', () => {
            log('Game OFF pressed');
            try {
                Util.spawn(['sh', '-c', 'xrandr --output DP-1-0.9 --primary --mode 1920x1080 --rate 60 --pos 0x420 --rotate normal --output DP-1-0.8 --mode 1920x1080 --rate 60 --pos 1920x0 --rotate right']);
            } catch (e) {
                logError(e, 'Failed to run command for Game OFF');
            }
        });
        this.menu.addMenuItem(gameOffItem);

        log('Display Setup Switcher extension initialized');
    }
});

/**
 * Extension Lifecycle Functions | manage the extension's state and UI elements.

    init(): Initializes the extension but does not add any UI elements.
    enable(): Adds the button to the GNOME top bar and sets up the menu items.
    disable(): Cleans up by removing the button from the top bar.
 */

function init() {
    log('Display Setup Switcher extension init');
}

let indicator;

function enable() {
    log('Display Setup Switcher extension enabled');
    indicator = new DisplaySwitcher();
    Main.panel.addToStatusArea('display_setup_switcher', indicator);
}

function disable() {
    log('Display Setup Switcher extension disabled');
    if (indicator) {
        indicator.destroy();
        indicator = null;
    }
}
