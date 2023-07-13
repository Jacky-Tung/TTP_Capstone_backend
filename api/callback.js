const express = require("express");
const router = express.Router();
const request = require("request");
const cors = require("cors");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

router.get("/", function (req, res) {
    let code = req.query.code || null;
    let state = req.query.state || null;

    if (state === null) {
        res.redirect(
            "/#" +
            querystring.stringify({
                error: "state_mismatch",
            })
        );
    } else {
        async function getSpotifyToken() {
            const url = 'https://accounts.spotify.com/api/token';
            let response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials',
                json: true
            });
            if (response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
            } else {
                console.log(response.statusText);
                throw new Error(`Request failed! Status code: ${response.status} ${response.statusText}`);
            }
        }

        getSpotifyToken();
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

module.exports = router