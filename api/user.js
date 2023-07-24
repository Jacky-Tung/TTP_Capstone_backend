const express = require("express");
var querystring = require("querystring");
const router = express.Router();
const {User} = require("../db/models");

// Get recently played songs - https://developer.spotify.com/documentation/web-api/reference/get-recently-played

/**
 * Fetch all users
 */
router.get("/", async (req, res, next) => {
    try {
        const allUsers = await User.findAll();
        allUsers
            ? res.status(200).json(allUsers)
            : res.status(404).send("User Listing Not Found");
    } catch (error) {
        next(error);
    }
});

/**
 * Fetch user by id
 */
router.get("/:id", async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        user
            ? res.status(200).json(user)
            : res.status(404).send("404 - User Not Found");
    } catch (err) {
        next(err);
    }
});

router.use(express.json());

// Post user by id
router.post("/", async (req, res) => {
    const user = await User.findOne({
        where: {
            userId: req.body.userId,
        },
    });

    if (!user) {
        try {
            const {
                userId,
                name,
                email,
            } = req.body;

            const newUser = await User.create({
                userId,
                name,
                email,
            });

            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({error: "Internal server error"});
        }
    } else {
        res.status(409).json({error: "User already exists in database"});
    }
});

module.exports = router;
