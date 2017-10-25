require('dotenv').config();

var CronJob = require('cron').CronJob;
var request = require('request');
var suncalc = require('suncalc');
var moment = require('moment');

var RASPAPI_URL = process.env.RASPAPI_URL;
var RASPAPI_AUTH = process.env.RASPAPI_AUTH;
var recordFairsTokenUrl = process.env.RECORDFAIRS_TOKEN_URL;
var geolocation = {
    lat: parseFloat(process.env.GEOLOCATION_LAT),
    lng: parseFloat(process.env.GEOLOCATION_LNG)
};

function lightsOn() {
    request({
        url: RASPAPI_URL + '/lights/on',
        headers: {
            'Authorization': RASPAPI_AUTH
        }
    }, function(error, response, body) {
        if (error) {
            console.error(error);
        } 
        console.log('turned lights on');
    });
}

function randomLightColor() {
    // one in seven chance of changing a light
    if (Math.floor((Math.random() * 7) + 1) != 1) {
        return false;
    };
    request({
        url: RASPAPI_URL + '/lights/lights',
        headers: {
            'Authorization': RASPAPI_AUTH
        }
    }, function(error, response, body) {
        if (error) {
            return false;
        }
        body = JSON.parse(body);
        var randomId = Math.floor((Math.random() * body.lights.length));
        // change the randomly selected light to a random color
        request(RASPAPI_URL + '/lights/lights/' + body.lights[randomId].id + '/random', function(error, response, body) {
            return true;
        });
    });
}

function dimLights() {
    request({
        url: RASPAPI_URL + '/lights/brightness/dec',
        headers: {
            'Authorization': RASPAPI_AUTH
        }
    }, function(error, response, body) {
        if (error) {
            console.error(error);
        } 
        console.log('dimmed lights');
    });
}

function undimLights() {
    request({
        url: RASPAPI_URL + '/lights/brightness/inc',
        headers: {
            'Authorization': RASPAPI_AUTH
        }
    }, function(error, response, body) {
        if (error) {
            console.error(error);
        } 
        console.log('undimmed lights');
    });
}

function lightsOff() {
    request({
        url: RASPAPI_URL + '/lights/off',
        headers: {
            'Authorization': RASPAPI_AUTH
        }
    }, function(error, response, body) {
        if (error) {
            console.error(error);
        } 
        console.log('lights off');
    });
}

var lightsOnWeekdaysMorning = new CronJob({
    cronTime: '0 0 7 * * 1-5',
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
    cronTime: '0 20 8 * * 1-5',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOnEvening = new CronJob({
    cronTime: '0 0 4 * * *',
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
    cronTime: '0 55 21 * * 0-4',
    onTick: function() {
        dimLights();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekdaysEvening = new CronJob({
    cronTime: '0 0 22 * * 0-4',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var dimLightsWeekendEvening = new CronJob({
    cronTime: '0 55 0 * * 0,5-6',
    onTick: function() {
        dimLights();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var lightsOffWeekendEvening = new CronJob({
    cronTime: '0 0 01 * * 0,5-6',
    onTick: function() {
        lightsOff();
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

var updateRecordFairs = new CronJob({
    cronTime: '0 0 0 * * *',
    onTick: function() {
        console.log('updating recordfairs, ', new Date());
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
        console.log('waking recordfairs, ', new Date());
        request.get('http://recordfairs.nl/favicon-16x16.png', function(error, response, body) {
            console.log('woke recordfairs, ', new Date());
        });
    },
    start: true,
    timeZone: 'Europe/Amsterdam'
});

console.log('scheduled cronjobs', new Date());
