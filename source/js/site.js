$(document).ready(function () {
    $("#toggle-nav").on("click", function () {
        $(this).toggleClass("active");
        $("#main-navigation").toggleClass("hidden shown");
    });
});