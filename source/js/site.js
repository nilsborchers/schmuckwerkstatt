$(document).ready(function (){
    $("#toggle-nav").on("click", function () {
        $(this).toggleClass("active");
        $("#main-navigation").toggleClass("hidden shown");
    });
});

// flickr credentials
var key     = "e0fa02316c6bd15840b018dad642aeec",
    secret  = "36e65bd21c716e79",
    userId  = "89651867@N02";

function getPhotosets (key, userId, wrapper) {
    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=" + key + "&user_id=" + userId + "&format=json&jsoncallback=?", function (data) {
        var list = $("<ul/>");
        wrapper = $(wrapper);

        // loop sets and pack into <li>
        $.each(data.photosets.photoset, function (i, set) {
            var li = $("<li/>").appendTo(list),
                title = $("<span/>", {
                    "text":     set.title._content,
                    "class":    "title"
                }).appendTo(li),
                pics = $("<div/>", {
                    "class":    "pictures-in-set"
                }).appendTo(li);

            // append on click function
            li.on("click", function () {
                $(this).unbind("click");
                getPhotosInSet(key, set.id, pics, false);
            });

            getPhotosInSet(key, set.id, li, true);
        });
        
        list.appendTo(wrapper);
    });
}

function getPhotosInSet (key, setId, wrapper, index) {

    wrapper = $(wrapper);
    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=" + key + "&photoset_id=" + setId + "&format=json&nojsoncallback=1", function (data) {
        if (index === true) {
            var indexId = Math.floor(Math.random() * data.photoset.total);
            getPhoto(key, data.photoset.photo[indexId].id, wrapper, false);
        } else {
            $.each(data.photoset.photo, function (i, photo) {
                getPhoto(key, photo.id, wrapper, true);
            });
            console.log(wrapper.parent());
            // hide index photo
            wrapper.siblings("img").addClass("hidden");

            // add close button
            $("<a/>", {
                "class": "closeSet",
                "text": "close"
            }).prependTo(wrapper.parent())
            .on("click", function () {
                $(this).siblings(".pictures-in-set, img").toggleClass("hidden");
            });
        }
    });
}

/**
 * get flickr photo for specified id
 * @param  {[type]} key     
 * @param  {[type]} photoId 
 * @param  {[type]} wrapper element to append the image to
 * @param  {[type]} click   wether or not to append click function to call biggest available image on click
 */
function getPhoto (key, photoId, wrapper, click) {
    wrapper = $(wrapper);
    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + key + "&photo_id=" + photoId + "&format=json&nojsoncallback=1", function (data) {
        // create image tag
        var image = $("<img/>", {
            src: data.sizes.size[1].source
        })
        .appendTo(wrapper);

        // if the picture is NOT the index thumb get the big version click
        if (click === true) {
            image.on("click", function (e) {
                var $this = $(this),
                    imageSize = 1;

                if ($this.hasClass("large")) {
                    imageSize = 1;
                } else {
                    imageSize = data.sizes.size.length - 1;
                }

                $this
                    .toggleClass("large")
                    .attr("src", data.sizes.size[imageSize].source);
            });    
        }
    });
}