$(function () {
    var $locationInput = $("#location-input");
    var $searchBtn = $("#search-btn");
    var $header = $("header");
    var $headerSpan = $("header span");
    var $footer = $("footer");

    // AJAX-ing the weather
    $searchBtn.click(submitted);

    $locationInput.on('keypress', function (e) {
        if (e.keyCode === 13) submitted();
    });
    // Animating the Header
    var originalHeaderHeight = $header.outerHeight();

    function animateHeader() {
        var amountScrolled = $(window).scrollTop();
        var footerOffset = $footer.offset().top - amountScrolled;
        if (amountScrolled > 3 * originalHeaderHeight) {
            $header.addClass("header-small");
            if (footerOffset < 0.5 * originalHeaderHeight) {
                $header.addClass("header-minimal");
            }
        }
        else {
            $header.removeClass("header-small");
            if ($header.has("header-minimal")) {
                $header.removeClass("header-minimal");
            }
        }
        requestAnimationFrame(animateHeader);
    }

    animateHeader();

});

function submitted() {
    var appid = 'appid=' + '307bf47f63f48e69bfd6a3b5130c5a2e' + '&';
    var city = 'q=' + document.getElementById("location-input").value + '&';

    $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/weather?units=metric&' + appid + city,
        success: function (result) {
            renderHTML(result);
        },
        error: function () {
            console.log("Error AJAX-ing the JSON");
        }
    })
}

function renderHTML(data) {
    document.getElementById("location").innerHTML = '<p>Location:</p>' + data.name + ', ' + data.sys.country;
    document.getElementById("weather-desc").innerHTML = data.weather[0].main;
    $("#weather-img").attr("data", 'img/weather-img/set-1/' + data.weather[0].icon + '.svg');
    document.getElementById("temp").innerHTML = data.main.temp + '°c';
    document.getElementById("pressure").innerHTML = '<p>Pressure:</p>' + data.main.pressure + ' mBar';
    document.getElementById("humidity").innerHTML = '<p>Humidity:</p>' + data.main.humidity + '%';
    document.getElementById("temp-min").innerHTML = data.main.temp_min + '°c ↓';
    document.getElementById("temp-max").innerHTML = data.main.temp_max + '°c ↑';
    document.getElementById("visibility").innerHTML = '<p>Visibility:</p>' + data.visibility / 1000 + ' km';
    document.getElementById("wind-speed").innerHTML = '<p>Wind Speed:</p>' + ((data.wind.speed * 18) / 5).toFixed(2) + ' km/h';
    document.getElementById("wind-deg").innerHTML = '<p>Wind Direction:</p>' + data.wind.deg + '°';
    document.getElementById("clouds").innerHTML = '<p>Clouds:</p>' + data.clouds.all + '%';
    document.getElementById("date").innerHTML = getTime(data.dt).format1;
    document.getElementById("sunrise").innerHTML = '<p>Sunrise:</p>' + getTime(data.sys.sunrise).format_12 + ' AM';
    document.getElementById("sunset").innerHTML = '<p>Sunset:</p>' + getTime(data.sys.sunset).format_12 + ' PM';

}

function getTime(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var monthsLong = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var daysLong = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'];
    return {
        "YYYY": a.getFullYear(),
        "MMMM": monthsLong[a.getMonth()],
        "MMM": monthsShort[a.getMonth()],
        "M": a.getMonth() + 1,
        "DDDD": daysLong[a.getDay()],
        "DDD": daysShort[a.getDay()],
        "DD": a.getDate(),
        "HH": a.getHours(),
        "MM": a.getMinutes(),
        "SS": a.getSeconds(),
        "format1": a.getDay() + ' ' + monthsLong[a.getMonth()] + ', ' + daysLong[a.getDay()],
        "format_24": a.getHours() + ':' + a.getMinutes(),
        "format_12": a.getHours() % 12 + ':' + a.getMinutes()
    };
}
