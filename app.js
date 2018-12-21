var express = require("express");
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.send('<h1>This is my web app');
});

app.post("/ai", function (req, res) {
    var response = "This is a sample response from your webhook!";
    var amount = req.body.queryResult.parameters.amount;
    var toCurr = req.body.queryResult.parameters.toCurrency;
    var fromCurr = req.body.queryResult.parameters.fromCurrency;
    var request = require('request');

    request("https://aceaide.herokuapp.com/currency/" + amount + "/" + fromCurr + "/" + toCurr, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var obj = JSON.parse(body);
        // v1
        // res.send(JSON.stringify({ "speech": obj.result,
        //					  	"displayText": obj.result
        //}));
        res.send(JSON.stringify({
                "fulfillmentText": obj.result
            }));
    });

    var city = "krypton";
    city = req.body.queryResult.parameters["geo-city"];
    var dateString = req.body.queryResult.parameters.date;
    var date = new Date(dateString);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var request = require('request');
    request("https://aceaide.herokuapp.com/weather/" + city + "/" + month + "/" + day,
        function (error, response, body) {

        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var obj = JSON.parse(body);
        // v1
        // res.send(JSON.stringify({ "speech": obj.result,
        //					  	"displayText": obj.result
        //}));
        res.send(JSON.stringify({
                "fulfillmentText": obj.result
            }));

    }); // end of request
    
});

var listener = app.listen(process.env.PORT, process.env.IP, function () {
        console.log("server has started");
        console.log('Listening on port ' + listener.address().port);
    });

// ////////////////////////////////////////////
// This is for the currency API
// the variables here start with ":"
app.get("/currency/:amount/:fromcurr/:tocurr", function (req, res) {
    var request = require('request');
    var fromC = req.params.fromcurr.toUpperCase();
    var toC = req.params.tocurr.toUpperCase();
    var amount = parseFloat(req.params.amount);
    console.log("amount is " + amount);
    console.log("fromc is " + fromC);
    console.log("toc is " + toC);
    request("http://data.fixer.io/latest?access_key=123acc77a12a427f0f93058b9198a979&symbols=" + fromC + "," + toC, function (error, response, body) {

        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var obj = JSON.parse(body);
        var rate1 = parseFloat(obj.rates[fromC]);
        var rate2 = parseFloat(obj.rates[toC]);
        console.log('rate1:' + rate1);
        console.log('rate2:' + rate2);
        var total = amount * parseFloat(rate2) / parseFloat(rate1);
        var s = (amount + " " + fromC + " is equal to " + total.toFixed(4) + " " + toC);

        res.send(JSON.stringify({
                "result": s
            }));
    });
});

// ///////////////////////////////////////////////////
// These are for the weather API
app.get("/weather/:city", function (req, res) {
    var request = require('request');
    var city = req.params.city.toUpperCase();
    //api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    //api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    console.log("city " + city);
    if (city == null) {
        city = "singapore";
    }
    request("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&apikey=c613ccd64d566f6599cc70f52322b423", function (error, response, body) {

        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var obj = JSON.parse(body);
        var list = obj.list[0];
        console.log("total length: " + obj.list.length);

        var s = ""
            for (var i = 0; i < obj.list.length; i++) {
                var date = new Date(obj.list[i].dt * 1000);
                var weather = obj.list[i].weather[0].description;
                s = s + date + " " + weather;
            }

            res.send(JSON.stringify({
                    "result": s
                }));
    });

});

app.get("/weather/:city/:month/:day", function (req, res) {
    var request = require('request');
    var city = req.params.city.toUpperCase();
    var month = req.params.month;
    var day = req.params.day;
    //api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    //api.openweathermap.org/data/2.5/forecast?q={city name},{country code}
    console.log("city " + city);
    if (city == null) {
        city = "singapore";
    }
    request("http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&apikey=c613ccd64d566f6599cc70f52322b423", function (error, response, body) {

        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
        var obj = JSON.parse(body);
        var list = obj.list[0];
        console.log("total length: " + obj.list.length);
        var tempDate = new Date("2018-11-09T12:00:00+08:00");
        console.log('tempdate month is ' + tempDate.getMonth());
        var s = ""
            var description = "none found"
            for (var i = 0; i < obj.list.length; i++) {
                var date = new Date(obj.list[i].dt * 1000);
                var weather = obj.list[i].weather[0].description;
                if ((date.getMonth() + 1) == month && date.getDate() == day) {
                    description = weather;
                    description = description + " " + date.toString();
                }
                //s = s + date + " " + weather;
            }

            res.send(JSON.stringify({
                    "result": description
                }));
    });

});


