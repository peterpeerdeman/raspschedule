require('dotenv').config();

var schedule = require('node-schedule');
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

var lightsOnWeekdaysMorning = schedule.scheduleJob('0 0 7 * * 1-5', function() {
    var times = suncalc.getTimes(new Date(), geolocation.lat, geolocation.lng);
    console.log("sunrise at: " + times.sunrise + ", triggered at: " + new Date());
    console.log("sunrise>now: ",  times.sunrise > new Date());
    if (times.sunrise > new Date()) {
        lightsOn();
        undimLights();
    }
});

var lightsOffWeekdaysMorning = schedule.scheduleJob('0 20 8 * * 1-5', function() {
    lightsOff();
});

var lightsOnEvening = schedule.scheduleJob('0 0 4 * * *', function() {
    var times = suncalc.getTimes(new Date(), geolocation.lat, geolocation.lng);
    console.log("sunset: " + times.sunset);
    console.log("scheduling for: " + moment(times.sunset).subtract(30, 'minutes').toDate());
    const sunsetJob = schedule.scheduleJob(moment(times.sunset).subtract(30, 'minutes').toDate(), function() {
        console.log("turning light on evening at: " + new Date());
        lightsOn();
        randomLightColor();
    });
});

var dimLightsWeekdaysEvening = schedule.scheduleJob('0 55 21 * * 0-4', function() {
    dimLights();
});

var lightsOffWeekdaysEvening = schedule.scheduleJob('0 0 22 * * 0-4', function() {
    lightsOff();
});

var dimLightsWeekendEvening = schedule.scheduleJob('0 55 0 * * 0,5-6', function() {
    dimLights();
});

var lightsOffWeekendEvening = schedule.scheduleJob('0 0 1 * * 0,5-6', function() {
    lightsOff();
});

var updateRecordFairs = schedule.scheduleJob('0 0 0 * * *', function() {
    console.log('updating recordfairs, ', new Date());
    request.post(recordFairsTokenUrl, function(error, response, body) {
        console.log('updated recordfairs, ', new Date());
    });
});

var wakeRecordFairs = schedule.scheduleJob('0 0 8-24 * * *', function() {
    console.log('waking recordfairs, ', new Date());
    request.get('http://recordfairs.nl/favicon-16x16.png', function(error, response, body) {
        console.log('woke recordfairs, ', new Date());
    });
});

console.log('scheduled cronjobs', new Date());
