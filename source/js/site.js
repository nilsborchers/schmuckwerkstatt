$(function (){
    $("#toggle-nav").on("click", function () {
        $(this).toggleClass("active");
        $("#main-navigation").toggleClass("shown");
    });

    if($('#flickr-sets').length > 0) { getPhotosets(key, userId, "#flickr-sets") };

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
            var li =        $("<li/>").appendTo(list),
                loading =   $("<div/>", {
                                "text":     "laden",
                                "class":    "loader"
                            }).appendTo(li),
                title =     $("<span/>", {
                                "text":     set.title._content,
                                "class":    "title"
                            }).appendTo(li),
                pics =      $("<div/>", {
                                "class":    "pictures-in-set hidden"
                            }).appendTo(li);

            // get the index pic
            getPhotosInSet(key, set.id, li, true);

            // append on click function
            li.on("click", function () {
                var picContainer = $(this).find(".pictures-in-set");
                // see if the pictures in the set are already loaded
                if(picContainer.data("loaded") !== true) {
                    $("<div/>", {
                        "class": "loader",
                        "text": "Bilder laden"
                    }).prependTo(pics);

                    getPhotosInSet(key, set.id, pics, false);
                }
                // open the container and set the current set active
                picContainer.toggleClass("hidden");
                $(this).toggleClass("active");
            });
        });

        // append the finished list into place
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

            // add close button
            $("<a/>", {
                "class": "close-set",
                "text": "×"
            }).prependTo(wrapper)
            .on("click", function (e) {
                e.stopPropagation();
                $(this).parent().toggleClass("hidden").parent().toggleClass("active");
            });

            // finish loading pics
            wrapper.attr("data-loaded", true);
            wrapper.find(".loader").remove();
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
        });

        // if the picture is NOT the index thumb get the big version
        if (click === true) {
            image.on("click", function (e) {
                e.stopPropagation();
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
            }).appendTo(wrapper);
        } else {
            // if it is the index prepend instead of append so it's before the title
            image.prependTo(wrapper);
            image.siblings(".loader").remove();
        }
    });
}