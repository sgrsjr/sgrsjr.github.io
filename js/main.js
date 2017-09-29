$(function () {
    $("#submit-btn").click(submitted);
    $("#location-input").on('keypress', function (e) {
        if (e.keyCode == 13) submitted();
    })

    var mainOffset = $(".main.section").offset();
    var sectionOffset = $(".details.section").offset();

    $(window).on('scroll', function () {
        scrolled(mainOffset, sectionOffset);
    });
});

function scrolled(mainOffset, sectionOffest) {
    var amountScrolled = $(document).scrollTop();

    var mainSectionHeight = $(".main.section").outerHeight();

    $("#status").html(amountScrolled - sectionOffest.top + mainSectionHeight);

    // if (amountScrolled >= sectionOffest.top - mainSectionHeight) {
    //
    // }
    // else
    if (amountScrolled >= mainOffset.top && amountScrolled < (sectionOffest.top - mainSectionHeight)) {
        $(".main.section").css({"position": "fixed"});
    }
    else {
        $(".main.section").css({"position": "relative"});
    }


}


function submitted() {
    var appid = 'appid=' + '307bf47f63f48e69bfd6a3b5130c5a2e' + '&';
    var city = 'q=' + document.getElementById("location-input").value + '&';
    var url = 'http://api.openweathermap.org/data/2.5/weather?units=metric&' + appid + city;
    var request = new XMLHttpRequest();
    request.open('GET', url);
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            var jsonData = JSON.parse(request.responseText);
            renderHTML(jsonData);
        } else {
            console.log("We connected to the server, but it returned an error.");
        }
    };
    request.onerror = function () {
        console.log("Connection Error");
    };
    request.send();
};

function renderHTML(data) {
    document.getElementById("location").innerHTML = data.name + ', ' + data.sys.country;
    document.getElementById("weather-desc").innerHTML = data.weather[0].main;
    $("#weather-img").attr("data", 'img/weather-img/set-1/' + data.weather[0].icon + '.svg');
    document.getElementById("temp").innerHTML = data.main.temp + '°c';
    document.getElementById("pressure").innerHTML = data.main.pressure + ' mBar';
    document.getElementById("humidity").innerHTML = data.main.humidity + '%';
    document.getElementById("temp-min").innerHTML = data.main.temp_min + '°c ↓';
    document.getElementById("temp-max").innerHTML = data.main.temp_max + '°c ↑';
    document.getElementById("visibility").innerHTML = data.visibility / 1000 + ' km';
    document.getElementById("wind-speed").innerHTML = ((data.wind.speed * 18) / 5).toFixed(2) + ' km/h';
    document.getElementById("wind-deg").innerHTML = data.wind.deg + '°';
    document.getElementById("clouds").innerHTML = data.clouds.all + '%';
    document.getElementById("date").innerHTML = getTime(data.dt).format1;
    document.getElementById("sunrise").innerHTML = 'Sunrise ' + getTime(data.sys.sunrise).format_12 + ' AM';
    document.getElementById("sunset").innerHTML = 'Sunset ' + getTime(data.sys.sunset).format_12 + ' PM';

};


