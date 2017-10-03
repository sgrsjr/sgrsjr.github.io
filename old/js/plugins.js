// Avoid `console` errors in browsers that lack a console.
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.


// Self

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
        "format_12": a.getHours()%12 + ':' + a.getMinutes()
    };
}
