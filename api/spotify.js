/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require("express"); // Express web server framework
var router = express.Router();
var request = require("request"); // "Request" library
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
const { User } = require("../db/models");

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET; // Your secret
var redirect_uri = process.env.REDIRECT_URI; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

router
  .use(cors())
  .use(cookieParser());

router.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your router location requests authorization
  var scope =
    "user-read-private user-read-email user-read-playback-state user-read-currently-playing";
  const authURL = 
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      });
  res.json({ authURL });
});

/* response object for callback
{
   "access_token": "NgCXRK...MzYjw",
   "token_type": "Bearer",
   "scope": "user-read-private user-read-email",
   "expires_in": 3600,
   "refresh_token": "NgAagA...Um_SHo"
} */

router.get("/callback", function (req, res) {
  // your routerlication requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      `/#` +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
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
        request.get(options, async function (error, response, body) {
          if (!error && response.statusCode === 200) {
            // Store the user information in the database
            const { id, display_name, email, images } = body;
            try {
              // Check if the user already exists in the database
              let user = await User.findOne({ where: { email : email } });
                // Update the existing user record with the new tokens and other info about the user's spotify account
                user.display_name = display_name; 
                if(images[0])
                  user.profile_image_url = images[0].url; 
                user.access_token = access_token;
                user.refresh_token = refresh_token;
                await user.save();
              let userId = user.user_id; 
              // Redirect the user to the desired location
              res.redirect(
                `https://main--sunny-marzipan-74d73c.netlify.app/`
              );
            } catch (err) {
              console.error("Error storing user information:", err);
              res.redirect(
                `https://main--sunny-marzipan-74d73c.netlify.app/`
              );
            }
          }
        });
      } else {
        res.redirect(
          `https://main--sunny-marzipan-74d73c.netlify.app/`
        );
      }
    });
  }
});

/* response object for refresh token
{
   "access_token": "NgA6ZcYI...ixn8bUQ",
   "token_type": "Bearer",
   "scope": "user-read-private user-read-email",
   "expires_in": 3600
} */

router.get("/refresh_token/:user_id", async function (req, res) {
  // requesting access token from refresh token
  var user_id = req.params.user_id;
  const user = await User.findOne({where: {user_id: user_id}});
  if(!user.refresh_token || !user){
    res.redirect(
      `/#` +
        querystring.stringify({
          error: "Invalid User",
        })
    );
  }
  const refresh_token = user.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, async function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      user.access_token = access_token;
      await user.save();
      res.json({updatedAt: Date.now()});
    }
  });
});

module.exports = router
