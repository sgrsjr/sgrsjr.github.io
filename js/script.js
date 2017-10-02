$(function () {

    // $("header").append('<div id="status-1"></div>');
    // $("header").append('<div id="status-2"></div>');

    var originalHeaderHeight = $("header").outerHeight();

    $(window).on('scroll', function () {

        var amountScrolled = $(window).scrollTop();
        var sectionOffset = $("section").offset().top - amountScrolled;
        var headerHeight = $("header").outerHeight();

        if (sectionOffset < originalHeaderHeight) {
            var headerHeight = $("header").outerHeight();
            var newHeight = headerHeight + sectionOffset - headerHeight;
            $("header").css({"height": newHeight});

            // $("#search-img").addClass("fixed-top-right");
        }
        else {
            $("header").css({"height": originalHeaderHeight});
            // $("#search-img").removeClass("fixed-top-right");
        }


        // $("#status-1").html(amountScrolled);
        // $("#status-2").html(sectionOffset - headerHeight);
    })
})
