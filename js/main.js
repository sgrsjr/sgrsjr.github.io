$(function () {
    // Add Listeners for submit.
    submit();

    // Animations
    animate();
});

function submit() {
    var $locationInput = $("#location-input");
    var $searchBtn = $("#search-btn");
    $searchBtn.click(submitted);
    $locationInput.on('keypress', function (e) {
        if (e.keyCode === 13) submitted();
    });
    submitted();
}

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
    });

    $.ajax({
        type: 'GET',
        url: 'https://api.openweathermap.org/data/2.5/forecast?units=metric&' + appid + city,
        success: function (result) {
            console.log(result);

            // for (i = 1; i < result.list.length; i++) {
            //     console.log(result.list[i].dt_txt);
            // }

            var myJSON = {
                cnt: 0,
                start: 0,
                temps: []
            };

            var n = 15;
            for (var i = 0; i < n; i++) {
                if (i === 0) {
                    myJSON.start = result.list[0].dt;
                }
                var temp = {};
                temp[0] = result.list[i].main.temp;
                temp[1] = result.list[i].weather[0].icon;
                myJSON.temps.push(temp);
                myJSON.cnt++;
            }
            console.log(myJSON);
            render(myJSON);
        },
        error: function () {
            console.log("Error AJAX-ing the bigJSON");
        }
    })
}

function render(data) {
    var $ele = $("#temp-section").find("> div");

    for (var i = 0; i < data.cnt; i++) {
        var cardData = '<p>' + data.temps[i][0] + '°</p>';
        var cardImg = '<img src="img/weather-img/set-1/' + data.temps[i][1] + '.svg"/>';
        var time = getTime(data.start + (i * 10800)).HH;
        var cardTime = '<h6>' + (((time % 12) + (time / 12 > 1 ? " PM" : " AM"))) + '</h6>';
        $ele.append('<span class="card">' + ( cardData + cardImg + cardTime) + '</span>');
    }

    // $ele.style.paddingBottom = ($ele.offsetHeight - $ele.clientHeight) + 'px';
    // console.log(($ele.offsetHeight - $ele.clientHeight));
    console.log($ele);

}

function renderHTML(data) {
    document.getElementById("location").innerHTML = '<p>Location:</p>' + data.name + ', ' + data.sys.country;
    document.getElementById("weather-desc").innerHTML = data.weather[0].main;
    $("#weather-img").attr("data", 'img/weather-img/set-1/' + data.weather[0].icon + '.svg');
    document.getElementById("temp").innerHTML = data.main.temp + '<p>°</p><p>c</p>';
    document.getElementById("pressure").innerHTML = '<p>Pressure:</p>' + data.main.pressure + ' mBar';
    document.getElementById("humidity").innerHTML = '<p>Humidity:</p>' + data.main.humidity + '%';
    document.getElementById("temp-min").innerHTML = '<p>Night</p><p>' + data.main.temp_min + '°</p><p>↓</p>';
    document.getElementById("temp-max").innerHTML = '<p>Day</p><p>' + data.main.temp_max + '°</p><p>↑</p>';
    document.getElementById("visibility").innerHTML = '<p>Visibility:</p>' + data.visibility / 1000 + ' km';
    document.getElementById("wind-speed").innerHTML = '<p>Wind Speed:</p>' + ((data.wind.speed * 18) / 5).toFixed(2) + ' km/h';
    document.getElementById("wind-deg").innerHTML = '<p>Wind Direction:</p>' + data.wind.deg + '°';
    document.getElementById("clouds").innerHTML = '<p>Clouds:</p>' + data.clouds.all + '%';
    document.getElementById("date").innerHTML = getTime(data.dt).format1;
    document.getElementById("sunrise").innerHTML = '<p>Sunrise:</p>' + getTime(data.sys.sunrise).format_12 + ' AM';
    document.getElementById("sunset").innerHTML = '<p>Sunset:</p>' + getTime(data.sys.sunset).format_12 + ' PM';

}

function animate() {
    var $header = $("header");
    var $footer = $("footer");
    var $mainInfo = $("#main-info");
    var originalHeaderHeight = $header.outerHeight();

    animateHeader($header, $footer, $mainInfo, originalHeaderHeight);
}

function animateHeader($header, $footer, $mainInfo, originalHeaderHeight) {
    var amountScrolled = $(window).scrollTop();
    var footerOffset = $footer.offset().top - amountScrolled;
    if (amountScrolled > 3 * originalHeaderHeight) {
        $header.addClass("header-small");
        $mainInfo.addClass("main-small");
        if (footerOffset < 0.5 * originalHeaderHeight) {
            $header.addClass("header-minimal");
        }
    }
    else {
        $header.removeClass("header-small");
        $mainInfo.removeClass("main-small");
        if ($header.has("header-minimal")) {
            $header.removeClass("header-minimal");
        }
    }
    requestAnimationFrame(function () {
        animateHeader($header, $footer, $mainInfo, originalHeaderHeight);
    });
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
