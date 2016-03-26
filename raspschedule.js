var CronJob = require('cron').CronJob;
var request = require('request');
var apiUrl = 'http://localhost:3000/api';
var recordFairsTokenUrl = '';

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
