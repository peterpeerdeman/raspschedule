var CronJob = require('cron').CronJob;
var request = require('request');
var suncalc = require('suncalc');
var apiUrl = 'http://localhost:3000/api';
var recordFairsTokenUrl = '';
var geolocation = {
    lat: 52.4996287 
    lng: 4.9375694
}

function lightsOn() {
    request(apiUrl + '/lights/on', function(error, response, body) {
    })
}

function lightsOff() {
    request(apiUrl + '/lights/off', function(error, response, body) {
    })
}

var lightsOnWeekdaysMorning = new CronJob({
    cronTime: '00 00 07 * * 1-5',
    onTick: function() {
        var times = suncalc.getTimes(new Date(), geolocation.lat, geolocation.lng)
        if (times.sunrise > new Date) {
            lightsOn();
        }
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdaysMorning = new CronJob({
    cronTime: '00 20 08 * * 1-5',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOnEvening = new CronJob({
    cronTime: '00 00 00 * * *',
    onTick: function() {
        var times = suncalc.getTimes(new Date(), geolocation.lat, geolocation.lng)
        new CronJob(
            times.sunset, 
            function() {
                lightsOn();
            },
            function() {
                /* This function is executed when the job stops */
            },
            true,
            'Europe/Amsterdam'
        );
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdaysEvening = new CronJob({
    cronTime: '00 00 22 * * 1-5,7',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekendEvening = new CronJob({
    cronTime: '00 00 01 * * 6,7',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var updateRecordFairs = new CronJob({
    cronTime: '00 00 00 * * *',
    onTick: function() {
        request.post(recordFairsTokenUrl, function(error, response, body) {
            console.log('updated recordfairs, ', new Date());
        });
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var wakeRecordFairs = new CronJob({
    cronTime: '0 0 8-24 * * *',
    onTick: function() {
        request.get('http://recordfairs.nl/favicon-16x16.png', function(error, response, body) {
        });
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});
