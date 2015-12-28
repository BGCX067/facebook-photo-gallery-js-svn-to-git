/**
 * Created by davdeev on 28.12.13.
 */

$import("core.Style");

var UI = {};

UI.STATES = {};
UI.STATES.LOGGEDOUT = "loggedout";
UI.STATES.LOGGEDIN = "loggedin";

UI.SELECTORS = {};
UI.SELECTORS.BODY = "body";
UI.SELECTORS.USER_NAME = "#user-name";
UI.SELECTORS.USER_PICTURE = "#user-picture";
UI.SELECTORS.GALLERY_CONTAINER = "#gallery-container";
UI.SELECTORS.USERS_LIST_CONTAINER = "#users-list-container";

UI.currentState = null;

UI.setState = function(state) {
    if (UI.currentState) {
        Style.removeClass(UI.SELECTORS.BODY, UI.currentState);
    }
    Style.addClass(UI.SELECTORS.BODY, state);
    UI.currentState = state;
};

UI.getState = function() {
    return UI.currentState;
};

UI.setUserName = function(name) {
    $element(UI.SELECTORS.USER_NAME).innerHTML = name;
};

UI.setUserPicture = function(url) {
    $element(UI.SELECTORS.USER_PICTURE).src = url;
};