const express = require("express");
const router = express.Router();
const request = require("request");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

/* response object for callback
{
   "access_token": "NgCXRK...MzYjw",
   "token_type": "Bearer",
   "scope": "user-read-private user-read-email",
   "expires_in": 3600,
   "refresh_token": "NgAagA...Um_SHo"
} */

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

// request.post(authOptions, function (error, response, body) {
//   if (!error && response.statusCode === 200) {
//     var access_token = body.access_token,
//       refresh_token = body.refresh_token;

//     var options = {
//       url: "https://api.spotify.com/v1/me",
//       headers: { Authorization: "Bearer " + access_token },
//       json: true,
//     };

//     // use the access token to access the Spotify Web API
//     request.get(options, function (error, response, body) {
//       console.log(body);
//     });

//     // we can also pass the token to the browser to make requests from there
//     res.redirect(
//       "/#" +
//         querystring.stringify({
//           access_token: access_token,
//           refresh_token: refresh_token,
//         })
//     );
//   } else {
//     res.redirect(
//       "/#" +
//         querystring.stringify({
//           error: "invalid_token",
//         })
//     );
//   }
// });

/* response object for refresh token
{
   "access_token": "NgA6ZcYI...ixn8bUQ",
   "token_type": "Bearer",
   "scope": "user-read-private user-read-email",
   "expires_in": 3600
} */
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

module.exports = router;
