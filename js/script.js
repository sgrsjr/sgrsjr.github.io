$(function () {

    // AJAX-ing the weather
    $("#search-btn").click(submitted);
    $("#location-input").on('keypress', function (e) {
        if (e.keyCode === 13) submitted();
    });

    // Animating the Header
    var originalHeaderHeight = $("header").outerHeight();

    function animateHeader() {
        var amountScrolled = $(window).scrollTop();
        var sectionOffset = $("section").offset().top - amountScrolled;
        if (sectionOffset < originalHeaderHeight) {
            $("header").addClass("header-small");
            // $("header").children().removeClass("header-small");
        }
        else {
            // $("header").children().addClass("header-small");
            $("header").removeClass("header-small");
        }
        requestAnimationFrame(animateHeader);
    }

    animateHeader();

});


function submitted() {
    var appid = 'appid=' + '307bf47f63f48e69bfd6a3b5130c5a2e' + '&';
    var city = 'q=' + document.getElementById("location-input").value + '&';
    console.log(city);

    $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?units=metric&' + appid + city,
        success: function (result) {
            console.log(result);
            renderHTML(result);
        },
        error: function () {
            alert("Error AJAX-ing the JSON");
        }
    })
}

function renderHTML(data) {
    // document.getElementById("location").innerHTML = data.name + ', ' + data.sys.country;
    document.getElementById("weather-desc").innerHTML = data.weather[0].main;
    $("#weather-img").attr("data", 'img/weather-img/set-1/' + data.weather[0].icon + '.svg');
    document.getElementById("temp").innerHTML = data.main.temp + '°c';
    // document.getElementById("pressure").innerHTML = data.main.pressure + ' mBar';
    // document.getElementById("humidity").innerHTML = data.main.humidity + '%';
    document.getElementById("temp-min").innerHTML = data.main.temp_min + '°c ↓';
    document.getElementById("temp-max").innerHTML = data.main.temp_max + '°c ↑';
    // document.getElementById("visibility").innerHTML = data.visibility / 1000 + ' km';
    // document.getElementById("wind-speed").innerHTML = ((data.wind.speed * 18) / 5).toFixed(2) + ' km/h';
    // document.getElementById("wind-deg").innerHTML = data.wind.deg + '°';
    // document.getElementById("clouds").innerHTML = data.clouds.all + '%';
    document.getElementById("date").innerHTML = getTime(data.dt).format1;
    // document.getElementById("sunrise").innerHTML = 'Sunrise ' + getTime(data.sys.sunrise).format_12 + ' AM';
    // document.getElementById("sunset").innerHTML = 'Sunset ' + getTime(data.sys.sunset).format_12 + ' PM';

}
