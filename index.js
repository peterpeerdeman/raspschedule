var CronJob = require('cron').CronJob;
var request = require('request');
var apiUrl = 'http://localhost:3000/api';

function lightsOn() {
    request(apiUrl + '/lights/on', function(error, response, body) {
        if (error) return;
        request('/lights/randomcolors', function(error, response, body) {
        })
    })
}

function lightsOff() {
    request(apiUrl + '/lights/off', function(error, response, body) {
        //
    })
}

var lightsOnWeekdays = new CronJob({
    cronTime: '00 00 07,18 * * 1-5',
    onTick: function() {
        lightsOn();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdays = new CronJob({
    cronTime: '00 00 09,22 * * 1-5',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});
