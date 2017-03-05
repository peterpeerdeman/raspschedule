var CronJob = require('cron').CronJob;
var request = require('request');
var suncalc = require('suncalc');
var moment = require('moment');

var apiUrl = 'http://localhost:3000/api';
var recordFairsTokenUrl = '';
var geolocation = {
    lat: 52.4996287,
    lng: 4.9375694
};

function lightsOn() {
    request(apiUrl + '/lights/on', function(error, response, body) {
    });
}


function randomLightColor() {
    // one in seven chance of changing a light
    if (Math.floor((Math.random() * 7) + 1) != 1) {
        return false;
    };
    request(apiUrl + '/lights/lights', function(error, response, body) {
        if (error) {
            return false;
        }
        body = JSON.parse(body);
        var randomId = Math.floor((Math.random() * body.lights.length));
        // change the randomly selected light to a random color
        request(apiUrl + '/lights/lights/' + body.lights[randomId].id + '/random', function(error, response, body) {
            return true;
        });

    });
}

function dimLights() {
    request(apiUrl + '/lights/brightness/dec', function(error, response, body) {
    })
}

function undimLights() {
    request(apiUrl + '/lights/brightness/inc', function(error, response, body) {
    })
}

function lightsOff() {
    request(apiUrl + '/lights/off', function(error, response, body) {
    });
}

var lightsOnWeekdaysMorning = new CronJob({
    cronTime: '00 00 07 * * 1-5',
    onTick: function() {
        var times = suncalc.getTimes(new Date(), geolocation.lat, geolocation.lng);
        console.log("sunrise at: " + times.sunrise + ", triggered at: " + new Date());
        if (times.sunrise > new Date()) {
            lightsOn();
            undimLights();
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
    cronTime: '00 00 04 * * *',
    onTick: function() {
        var times = suncalc.getTimes(new Date(), geolocation.lat, geolocation.lng);
        console.log("sunset: " + times.sunset);
        console.log("scheduling for: " + moment(times.sunset).subtract(30, 'minutes').toDate());
        new CronJob(
            moment(times.sunset).subtract(30, 'minutes').toDate(), 
            function() {
                console.log("turning light on evening at: " + new Date());
                lightsOn();
                randomLightColor();
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

var dimLightsWeekdaysEvening = new CronJob({
    cronTime: '00 55 21 * * 0-4',
    onTick: function() {
        dimLights();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdaysEvening = new CronJob({
    cronTime: '00 00 22 * * 0-4',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var dimLightsWeekendEvening = new CronJob({
    cronTime: '00 55 00 * * 0,5,6',
    onTick: function() {
        dimLights();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekendEvening = new CronJob({
    cronTime: '00 00 01 * * 0,5,6',
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
