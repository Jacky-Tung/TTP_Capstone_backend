const express = require("express");
const router = express.Router();
const request = require("request"); 
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

router.get("/callback", function (req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };
  }
});

request.post(authOptions, function (error, response, body) {
  if (!error && response.statusCode === 200) {
    var access_token = body.access_token,
      refresh_token = body.refresh_token;

    var options = {
      url: "https://api.spotify.com/v1/me",
      headers: { Authorization: "Bearer " + access_token },
      json: true,
    };

    // use the access token to access the Spotify Web API
    request.get(options, function (error, response, body) {
      console.log(body);
    });

    // we can also pass the token to the browser to make requests from there
    res.redirect(
      "/#" +
        querystring.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
        })
    );
  } else {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "invalid_token",
        })
    );
  }
});

router.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});
