var CronJob = require('cron').CronJob;
var request = require('request');
var apiUrl = 'http://localhost:3000/api';

var lightsOnWeekdays = new CronJob({
    cronTime: '00 00 18 * * 1-5',
    onTick: function() {
        request(apiUrl + '/lights/on', function(error, response, body) {
            if (error) return;
            request('/lights/randomcolors', function(error, response, body) {
            })
        })
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdays = new CronJob({
    cronTime: '00 00 22 * * 1-5',
    onTick: function() {
        request(apiUrl + '/lights/off', function(error, response, body) {
            //
        })
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});
