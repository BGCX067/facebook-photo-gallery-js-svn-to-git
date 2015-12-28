$import("core.EventUtils");
$import("core.Style");

function Gallery(_container) {
    var containerElement = _container;
    var albums = new Array();
    var galleryElement = null;

    this.CLASSES = {};
    this.CLASSES.GALLERY = "gallery";
    this.CLASSES.ROW = "row";
    this.CLASSES.ALBUM_TITLE = "title";
    this.CLASSES.PHOTO = "photo";

    var _this = this;

    this.setAlbums = function(_albums) {
        albums = _albums;
        console.log("Gallery ready!", albums);
        fill();
    };

    var fill = function() {
        containerElement.innerHTML = "";
        galleryElement = document.createElement("DIV");
        galleryElement.className = _this.CLASSES.GALLERY;

        Array.iterate(albums, function(i, album) {

            var rowElement = document.createElement("DIV");
            rowElement.className = _this.CLASSES.ROW;

            var albumTitle = document.createElement("DIV");
            albumTitle.className = _this.CLASSES.ALBUM_TITLE;
            albumTitle.innerHTML = album.getInfo().name;

            Array.iterate(album.getPhotos(), function(i, photo) {
                console.log(photo);
                var imageContainerElement = document.createElement("DIV");
                imageContainerElement.className = _this.CLASSES.PHOTO;

                var imageElement = document.createElement("IMG");
                EventUtils.addListener(imageElement, "load", function() {
                    /*
                    var width = imageElement.width*2;
                    var height = imageElement.height*2;
                    imageElement.style.width = Style.toPx(1);
                    imageElement.style.height = Style.toPx(1);
                    imageElement.style.width = Style.toPx(width);
                    imageElement.style.height = Style.toPx(height);
                    */
                    imageElement.style.opacity = 1;
                });
                imageElement.src = photo.picture;

                imageContainerElement.appendChild(imageElement);
                rowElement.appendChild(imageContainerElement);
            });

            galleryElement.appendChild(albumTitle);
            galleryElement.appendChild(rowElement);
        });

        containerElement.appendChild(galleryElement);
    };
};

function Album(_info, _photos) {
    var info = _info;
    var photos = _photos;

    this.getInfo = function() {
        return info;
    };

    this.getPhotos = function() {
        return photos;
    };
};