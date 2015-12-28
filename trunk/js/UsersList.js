/**
 * Created by davdeev on 28.12.13.
 */

$import("core.EventUtils");
$import("core.Style");

function UsersList(_container) {
    var containerElement = _container;
    var users = new Array();
    var selectedUser = null;

    this.CLASSES = {};
    this.CLASSES.PICTURE = "picture";
    this.CLASSES.NAME = "name";
    this.CLASSES.SELECTED = "selected";

    var _this = this;

    this.setUsers = function(_users) {
        users = _users;
        console.log("UsersList ready!", users);
        fill();
    };

    var fill = function() {
        containerElement.innerHTML = "";

        Array.iterate(users, function(i, user) {

            var imageContainerElement = document.createElement("DIV");
            imageContainerElement.className = _this.CLASSES.PICTURE;
            imageContainerElement.id = getImageContainerId(user.getInfo().id);

            var userNameElement = document.createElement("DIV");
            userNameElement.className = _this.CLASSES.NAME;
            userNameElement.innerHTML = user.getInfo().name;

            var imageElement = document.createElement("IMG");
            var _user = user;

            EventUtils.addListener(imageElement, "load", function() {
                /*
                 var width = imageElement.width*2;
                 var height = imageElement.height*2;
                 imageElement.style.width = Style.toPx(1);
                 imageElement.style.height = Style.toPx(1);
                 imageElement.style.width = Style.toPx(width);
                 imageElement.style.height = Style.toPx(height);
                 */
                //imageElement.style.opacity = 0.25;
            });

            EventUtils.addListener(imageElement, "click", function() {
                selectUser(_user);
            });

            imageElement.src = user.getPicture().url;

            imageContainerElement.appendChild(imageElement);
            imageContainerElement.appendChild(userNameElement);
            containerElement.appendChild(imageContainerElement);
        });

        selectUser(Application.currentUser);
    };

    var selectUser = function(user) {
        if (selectedUser != null) {
            Style.removeClass(getImageContainerSelector(selectedUser.getInfo().id), _this.CLASSES.SELECTED);
        }
        selectedUser = user;
        Style.addClass(getImageContainerSelector(selectedUser.getInfo().id), _this.CLASSES.SELECTED);

        Application.selectUser(user);
    };

    var getImageContainerId = function(userId) {
        return _this.CLASSES.PICTURE + userId;
    };

    var getImageContainerSelector = function(userId) {
        return "#" + getImageContainerId(userId);
    };
};

function User(_info, _picture) {
    var info = _info;
    var picture = _picture;

    this.getInfo = function() {
        return info;
    };

    this.getPicture = function() {
        return picture;
    };
};
