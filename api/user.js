const express = require("express");
const router = express.Router();
const { User } = require("../db/models");

// Get recently played songs - https://developer.spotify.com/documentation/web-api/reference/get-recently-played

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        user ? res.status(200).json(user) : res.status(404).send("404 - User Not Found");
    } catch (err) {
        next(err);
    }
})

// Login - https://developer.spotify.com/documentation/web-api/tutorials/code-flow
router.get("/login", async (req, res) => {
    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';
  
    res.redirect('https://accounts.spotify.com/authorize?' +
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
      }));
})

// Fetch access token after successfully logging in 
router.get('/callback', function(req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;
  
    if (state === null) {
      res.redirect('/#' +
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };
    }
  });