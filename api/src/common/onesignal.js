const https = require("https");

let internals = {};

internals.sendNotification = function(data) {
  data.app_id = process.env.ONESIGNAL_APP_ID;

  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    Authorization: process.env.ONESIGNAL_AUTH_HEADER
  };

  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };

  var req = https.request(options, function(res) {
    res.on("data", function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });

  req.on("error", function(e) {
    console.log("ERROR:");
    console.log(e);
  });

  req.write(JSON.stringify(data));
  req.end();
};

module.exports = internals;
