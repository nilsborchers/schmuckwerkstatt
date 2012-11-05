$(document).ready(function (){
    $("#toggle-nav").on("click", function () {
        $(this).toggleClass("active");
        $("#main-navigation").toggleClass("hidden shown");
    });
});

$.fn.getFlickrAlbums = function() {
    var wrapper = $(this);

    $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=e0fa02316c6bd15840b018dad642aeec&user_id=89651867@N02&format=json&jsoncallback=?", function (data) {
        var list = $("<ul/>");
        $.each(data.photosets.photoset, function (i, set) {
            var li = $("<li/>", {
               "data-set": set.id
            }).appendTo(list);

            var title = $("<h3/>", {
                "text": set.title._content
            }).appendTo(li);

            $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=e0ee5448f3ac554abfa20ab0db0f5a38&photoset_id=" + set.id + "&format=json&nojsoncallback=1", function (data) {
                var indexId = Math.floor(Math.random() * data.photoset.total);
                
                $.getJSON("http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=e0ee5448f3ac554abfa20ab0db0f5a38&photo_id=" + data.photoset.photo[indexId].id + "&format=json&nojsoncallback=1", function (data) {
                    var image = $("<img/>", {
                        src: data.sizes.size[3].source
                    })
                    .appendTo(li)
                    .wrap('<a href="http://www.flickr.com/photos/89651867@N02/sets/'+ set.id +'" />');
                });
            });
        });
        list.appendTo(wrapper);
    });
}