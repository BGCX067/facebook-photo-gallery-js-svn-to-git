/**
 * Created by davdeev on 28.12.13.
 */

$import("Config");
$import("core.EventUtils");
$import("UI");
$import("Gallery");
$import("UsersList");

var Application = {};

Application.FB = {};
Application.FB.MY_USER_ID = "me";

Application.gallery = null;
Application.currentUser = null;
Application.usersList = null;

Application.init = function() {
    UI.setState(UI.STATES.LOGGEDOUT);
    Application.initFb(Application.onInitFb);
};

Application.initFb = function(callback) {
    // init the FB JS SDK
    FB.init({
        appId      : CONFIG.FB.APP_ID,                        // App ID from the app dashboard
        status     : true,                                 // Check Facebook Login status
        cookie     : true,                                  // enable cookies to allow the server to access the session
        xfbml      : true                                  // Look for social plugins on the page
    });

    // Additional initialization code such as adding Event Listeners goes here
    Function.wrapIfNull(callback).call();
};

Application.onInitFb = function() {
    Application.login();
};

Application.login = function() {
    FB.login(function(loginResponse) {
        if (loginResponse.authResponse) {
            Application.getUserInfo(Application.FB.MY_USER_ID, Application.onLogin);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: CONFIG.FB.APP_PERMISSIONS});
};

Application.getUserInfo = function (userId, callback) {
    FB.api('/' + userId, function(userInfoResponse) {
        Application.FB.MY_USER_ID = userInfoResponse.id;
        Application.getUserPicture(userId, function(userPictureResponse) {
            Function.wrapIfNull(callback).call(Application, new User(userInfoResponse, userPictureResponse));
        });
    });
};

Application.onLogin = function(user) {
    console.log(user);
    //Application.selectUser(user);
    UI.setState(UI.STATES.LOGGEDIN);

    Application.currentUser = user;
    Application.getUserFriends(user.getInfo().id);
};

Application.selectUser = function(user) {
    //UI.setUserName(user.getInfo().name);
    //UI.setUserPicture(user.getPicture().url);
    Application.getUserAlbums(user.getInfo().id);
};

Application.logout = function(callback) {
    FB.logout(function(logoutResponse) {
        Application.onLogout();
    });
};

Application.onLogout = function() {
    Application.updateGallery(new Array());
    Application.updateUsersList(new Array());
    UI.setState(UI.STATES.LOGGEDOUT);
};

Application.getUserPicture = function(userId, callback) {
    FB.api('/' + userId + '/picture', function(userPictureResponse) {
        console.log(userPictureResponse);
        Function.wrapIfNull(callback).call(Application, userPictureResponse.data);
    });
};

Application.getUserFriends = function(userId) {
    FB.api('/' + userId + '/friends', function(userFriendsResponse) {
        console.log(userFriendsResponse);
        Application.processUsers(userFriendsResponse.data);
    });
};

Application.processUsers = function(usersResponseData) {
    var users = new Array();
    users.push(Application.currentUser);
    Array.iterate(usersResponseData, function(i, value) {
        Application.getUserPicture(value.id, function(userPictureResponse) {
            users.push(new User(value, userPictureResponse));

            if (users.length == usersResponseData.length) {
                Application.updateUsersList(users);
            }
        });
    });
};

Application.updateUsersList = function(users) {
    if (!Application.usersList) {
        Application.usersList = new UsersList($element(UI.SELECTORS.USERS_LIST_CONTAINER));
    }
    Application.usersList.setUsers(users);
};

Application.getUserAlbums = function(userId) {
    FB.api('/' + userId + '/albums', function(albumsResponse) {
        console.log(albumsResponse);
        Application.processAlbums(albumsResponse.data);
    });
};

Application.processAlbums = function(albumsResponseData) {
    var albums = new Array();
    Array.iterate(albumsResponseData, function(i, value) {
        Application.getAlbumPhotos(value.id, function(albumsPhotosResponse) {
            albums.push(new Album(value, albumsPhotosResponse.data));

            if (albums.length == albumsResponseData.length) {
                Application.updateGallery(albums);
            }
        });
    });
};

Application.updateGallery = function(albums) {
    if (!Application.gallery) {
        Application.gallery = new Gallery($element(UI.SELECTORS.GALLERY_CONTAINER));
    }
    Application.gallery.setAlbums(albums);
};

Application.getAlbumPhotos = function(albumId, callback) {
    FB.api('/' + albumId + '/photos', function(albumsPhotosResponse) {
        console.log(albumsPhotosResponse);
        Function.wrapIfNull(callback).call(Application, albumsPhotosResponse);
    });
};

EventUtils.addListener(window, "load", Application.init);

