var CronJob = require('cron').CronJob;
var request = require('request');
var apiUrl = 'http://localhost:3000/api';

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
        lightsOn();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdaysMorning = new CronJob({
    cronTime: '00 30 08 * * 1-5',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOnWeekdaysEvening = new CronJob({
    cronTime: '00 30 16 * * 1-5',
    onTick: function() {
        lightsOn();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdaysEvening = new CronJob({
    cronTime: '00 00 22 * * 1-5',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});
