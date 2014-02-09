$(function (){
    var galleryWrapper = $('#facebook-photos');

    $("#toggle-nav").on("click", function () {
        $(this).toggleClass("active");
        $("#main-navigation").toggleClass("shown");
    });

    if(galleryWrapper.length > 0) {
        getFacebookPhotos(815269895166358, galleryWrapper);

        galleryWrapper.magnificPopup({
            delegate: 'a', // child items selector, by clicking on it popup will open
            type: 'image',
            gallery: {enabled:true}
        });
    };

});

var getFacebookPhotos = function(albumID, container) {
    $.getJSON('//graph.facebook.com/' + albumID + '/photos?', function(json, status, xhr) {
        $.each(json.data, function() {
            var item = $("<li/>", { "class": "photo" }),
                zoomLink = $("<a/>", {
                    "href": this.source,
                    "style": "background-image: url(" + this.images[5].source + ")"
                });

            zoomLink.appendTo(item);
            item.appendTo(container);
        });
    });
}
