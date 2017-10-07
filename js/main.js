$(function () {
    // Add Listeners for submit.
    submit();

    // Animations
    animate();
});

function submit() {
    var $locationInput = $("#location-input");
    var $searchBtn = $("#search-btn");
    var $span = $("header").find("> span");

    // Add Listeners for Submit
    $searchBtn.on('click', submitted);
    $locationInput.on('keypress', function (e) {
        if (e.keyCode === 13) submitted();
    });

    // Toggle 'active' class on $locationInput
    $locationInput.on('focusin', function () {
        $("html, body").animate({scrollTop: 0}, 300);
        $span.addClass("active");
    });
    $locationInput.on('blur', function () {
        $span.removeClass("active");
    });

    $.getJSON('https://ipinfo.io', function (locationData) {
        $locationInput.attr("value", locationData.city);
        submitted();
    });
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

            var myJSON = {
                cnt: 0,
                start: 0,
                temps: [],
                winds: []
            };

            var n = 15;
            for (var i = 0; i < n; i++) {
                if (i === 0) {
                    myJSON.start = result.list[0].dt;
                }
                // Temp
                var temp = {};
                temp[0] = result.list[i].main.temp;
                temp[1] = result.list[i].weather[0].icon;
                myJSON.temps.push(temp);

                // Wind
                var wind = {};
                wind[0] = result.list[i].wind.speed;
                wind[1] = result.list[i].wind.deg;
                myJSON.winds.push(wind);

                myJSON.cnt++;
            }
            render(myJSON);
        },
        error: function () {
            console.log("Error AJAX-ing the bigJSON");
        }
    })
}

function render(jsonData) {
    var $windSection = $("#wind-section").find("> div");

    for (var i = 0; i < jsonData.cnt; i++) {
        var windSpeed = '<p>' + ((jsonData.winds[i][0] * 18) / 5).toFixed(2) + ' km/h' + '</p>';
        var windDeg = '<p>' + jsonData.winds[i][1].toFixed(0) + '°' + '</p>';
        var imgStyle = 'style="transform:rotate(' + jsonData.winds[i][1] + 'deg)"';
        var img = '<img src="img/weather-img/wind.svg" ' + imgStyle + ' />';
        var time = getTime(jsonData.start + (i * 10800)).HH;
        var cardTime = '<h6>' + (((time % 12) + (time / 12 > 1 ? " PM" : " AM"))) + '</h6>';
        if (i === 0) {
            $windSection.html('<span class="card">' + (windDeg + img + windSpeed + cardTime) + '</span>');
        }
        else {
            $windSection.append('<span class="card">' + (windDeg + img + windSpeed + cardTime) + '</span>');
        }
    }

    // Chart

    var labels = [];
    var temps = [];
    for (var i = 0; i < jsonData.cnt; i++) {
        var temp = jsonData.temps[i][0];
        var time = getTime(jsonData.start + (i * 10800)).HH;
        var label = (((time % 12) + (time / 12 > 1 ? " PM" : " AM")));
        labels.push(label);
        temps.push(temp);
    }

    var $canvas = $("<canvas/>");
    var $tempChart = $("#temp-chart");
    $tempChart.html('<div><div></div></div>');
    $tempChart.find("> div > div").html($canvas);
    $tempChart.scrollLeft($tempChart.width);

    var chart = new Chart($canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: temps,
                pointRadius: 0
            }]
        },
        options: {
            layout: {
                padding: {
                    left: 0,
                    right: 0,
                    top: 15,
                    bottom: 0
                }
            },
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    display: false,
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    display: false,
                    gridLines: {
                        display: false
                    }
                }]
            },
            animation: {
                onProgress: function () {
                    // render the value of the chart above the bar
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'normal', Chart.defaults.global.defaultFontFamily);
                    var fontColor = '#000000';
                    var labelColor = '#3b3b3b'
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    this.data.datasets.forEach(function (dataset) {
                        for (var i = 0; i < dataset.data.length; i++) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                            if (i === 0) {
                                ctx.fillStyle = fontColor;
                                ctx.fillText(dataset.data[i].toFixed(0) + '°', model.x + 15, model.y - 5);
                                ctx.fillStyle = labelColor;
                                ctx.fillText(labels[i], model.x + 20, 210);
                            }
                            else if (i === dataset.data.length - 1) {
                                ctx.fillStyle = fontColor;
                                ctx.fillText(dataset.data[i].toFixed(0) + '°', model.x - 15, model.y - 5);
                                ctx.fillStyle = labelColor;
                                ctx.fillText(labels[i], model.x - 20, 210);
                            }
                            else {
                                ctx.fillStyle = fontColor;
                                ctx.fillText(dataset.data[i].toFixed(0) + '°', model.x, model.y - 5);
                                ctx.fillStyle = labelColor;
                                ctx.fillText(labels[i], model.x, 210);
                            }
                        }
                    });
                }
            }
        }
    });
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
    if (amountScrolled === 0) {
        $footer.removeClass("scrolled");
    }
    else {
        $(":focus").blur();
        $footer.addClass("scrolled");

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
        "format1": a.getDate() + ' ' + monthsLong[a.getMonth()] + ', ' + daysLong[a.getDay()],
        "format_24": a.getHours() + ':' + a.getMinutes(),
        "format_12": a.getHours() % 12 + ':' + a.getMinutes()
    };
}
