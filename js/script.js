$(function () {

    // $("header").append('<div id="status-1"></div>');
    // $("header").append('<div id="status-2"></div>');

    var originalHeaderHeight = $("header").outerHeight();
    function animateHeader() {

        var amountScrolled = $(window).scrollTop();
        var sectionOffset = $("section").offset().top - amountScrolled;
        if (sectionOffset < originalHeaderHeight) {
            $("header").addClass("header-small");
        }
        else {
            $("header").removeClass("header-small");
        }

        // $("#status-1").html(amountScrolled);
        // $("#status-2").html(sectionOffset - headerHeight);

        requestAnimationFrame(animateHeader);
    }
    animateHeader();




})
