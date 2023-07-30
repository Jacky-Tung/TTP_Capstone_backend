# Spotify Proximity

[![Build Status](https://img.shields.io/travis/your-username/your-repo.svg?style=flat-square)](https://travis-ci.org/your-username/your-repo)
[![License](https://img.shields.io/github/license/your-username/your-repo.svg?style=flat-square)](https://github.com/your-username/your-repo/blob/master/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/Jacky-Tung/your-repo.svg?style=flat-square)](https://github.com/Jacky-Tung/TTP_Capstone_backend/issues)

Proximity-based song discovery app integrating Spotify Web API and Google Maps API

## Table of Contents

- [About](#about)
- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
  - [User Endpoints](#user-endpoints)
  - [Song Endpoints](#song-endpoints)
  - [Playback Endpoints](#playback-endpoints)
  - [Spotify Endpoints](#spotify-endpoints)
  - [Active Playback Endpoints](#active-playback-endpoints)
  - [Error Responses](#error-responses)
  - [Authentication](#authentication)
- [Deployment](#deployment)

## About

A server-side application using the PERN stack and Sequelize to power a proximity-based song discovery app. The backend handles user authentication, Spotify API integration, and connection to PostgreSQL database for seamless music exploration.

## Features

- SpotifyOAuth
- Spotify Web API
- Database Model 

## Requirements

PERN Stack

## Getting Started

### Installation

1. Clone this repository: `git clone https://github.com/Jacky-Tung/TTP_Capstone_backend.git`
2. Change into the project directory: `cd your-repo`
3. Install dependencies: `npm install` or `yarn install`

### Configuration

  Environment variables

### Running the Application

```sh
npm start
```
# API Documentation

- [User Endpoints](#user-endpoints)
- [Song Endpoints](#song-endpoints)
- [Playback Endpoints](#playback-endpoints)
- [Spotify Endpoints](#spotify-endpoints)
- [Active Playback Endpoints](#active-playback-endpoints)
- [Error Responses](#error-responses)
- [Authentication](#authentication)

## User Endpoints

### Get All Users

- **Endpoint:** `/api/user/`
- **HTTP Method:** GET
- **Description:** Fetches all users from the database.
- **Response:**
  - 200 OK: Returns an array of all users.
  - 404 Not Found: If there are no users in the database.

### Get User by ID

- **Endpoint:** `/api/user/:id`
- **HTTP Method:** GET
- **Description:** Fetches a user by their ID.
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the user.
- **Response:**
  - 200 OK: Returns the user object.
  - 404 Not Found: If the user with the specified ID does not exist.

### Create a New User

- **Endpoint:** `/api/user/`
- **HTTP Method:** POST
- **Description:** Creates a new user in the database.
- **Request Body:**
  - `user_id` (required): User's ID.
  - `display_name` (required): User's display name.
  - `email` (required): User's email address.
- **Response:**
  - 201 Created: Returns the newly created user object.
  - 409 Conflict: If a user with the same email already exists in the database.

## Song Endpoints

### Get All Songs

- **Endpoint:** `/api/song/`
- **HTTP Method:** GET
- **Description:** Fetches all songs from the database.
- **Response:**
  - 200 OK: Returns an array of all songs.
  - 404 Not Found: If there are no songs in the database.

### Get Song by ID

- **Endpoint:** `/api/song/:id`
- **HTTP Method:** GET
- **Description:** Fetches a song by its ID.
- **Parameters:**
  - `id` (URL parameter): The unique identifier of the song.
- **Response:**
  - 200 OK: Returns the song object.
  - 404 Not Found: If the song with the specified ID does not exist.

### Create a New Song

- **Endpoint:** `/api/song/`
- **HTTP Method:** POST
- **Description:** Creates a new song in the database.
- **Request Body:**
  - `title` (required): Song title.
  - `artist` (required): Artist name.
  - `image_url`: URL of the song's image.
  - `external_url`: External URL of the song.
  - `preview_url`: Preview URL of the song.
- **Response:**
  - 201 Created: Returns the newly created song object.
  - 409 Conflict: If a song with the same title and artist already exists in the database.

### Get Currently Playing Song

- **Endpoint:** `/api/song/currently-playing`
- **HTTP Method:** GET
- **Description:** Fetches the currently playing song for a specific user.
- **Query Parameters:**
  - `user_id` (required): User's ID.
- **Response:**
  - 200 OK: Returns the currently playing song object.
  - 404 Not Found: If no song is currently playing for the specified user.

## Playback Endpoints

### Get All Playbacks

- **Endpoint:** `/api/playback/`
- **HTTP Method:** GET
- **Description:** Fetches all playbacks and playback details from the database.
- **Response:**
  - 200 OK: Returns an array of all playbacks with associated song and user details.
  - 404 Not Found: If there are no playbacks in the database.

### Get Playback by User ID and Song ID

- **Endpoint:** `/api/playback/:userId/:songId`
- **HTTP Method:** GET
- **Description:** Fetches a playback and its details by user ID and song ID.
- **Parameters:**
  - `userId` (URL parameter): User's ID.
  - `songId` (URL parameter): Song's ID.
- **Response:**
  - 200 OK: Returns the playback object with associated song and user details.
  - 404 Not Found: If the specified playback does not exist.

### Get Personal Playbacks by User ID

- **Endpoint:** `/api/playback/:userId`
- **HTTP Method:** GET
- **Description:** Fetches all playbacks for a specific user.
- **Parameters:**
  - `userId` (URL parameter): User's ID.
- **Response:**
  - 200 OK: Returns an array of playbacks with associated song details for the specified user.
  - 404 Not Found: If there are no playbacks for the specified user.

### Create a New Playback

- **Endpoint:** `/api/playback/`
- **HTTP Method:** POST
- **Description:** Creates a new playback in the database and adds playback details.
- **Request Body:**
  - `user_id` (required): User's ID.
  - `song_id` (required): Song's ID.
  - `latitude` (required): Latitude of the playback location.
  - `longitude` (required): Longitude of the playback location.
- **Response:**
  - 201 Created: Returns the newly created playback object with associated song and user details.
  - 500 Internal Server Error: If the playback or playback details creation fails.

## Spotify Endpoints

### Get Spotify Authorization URL

- **Endpoint:** `/api/spotify/login`
- **HTTP Method:** GET
- **Description:** Generates the Spotify authorization URL for the OAuth2 flow.
- **Response:**
  - 200 OK: Returns the authorization URL to redirect the user to for authentication.

### Spotify OAuth2 Callback

- **Endpoint:** `/api/spotify/callback`
- **HTTP Method:** GET
- **Description:** Handles the callback after Spotify authorization.
- **Response:**
  - 200 OK: Redirects the user to the desired location after successful authorization.

### Refresh Spotify Access Token

- **Endpoint:** `/api/spotify/refresh_token/:user_id`
- **HTTP Method:** GET
- **Description:** Refreshes the Spotify access token for a specific user.
- **Parameters:**
  - `user_id` (URL parameter): User's ID.
- **Response:**
  - 200 OK: Returns the updated access token and timestamp.
  - 404 Not Found: If the user with the specified ID does not exist.
  - 500 Internal Server Error: If the token refresh fails.

## Active Playback Endpoints

### Get All Active Playbacks

- **Endpoint:** `/api/active-playback/`
- **HTTP Method:** GET
- **Description:** Fetches all active playbacks and their details from the database.
- **Response:**
  - 200 OK: Returns an array of all active playbacks with associated song and user details.
  - 404 Not Found: If there are no active playbacks in the database.

### Delete Active Playback for a User

- **Endpoint:** `/api/active-playback/:userId`
- **HTTP Method:** DELETE
- **Description:** Deletes the active playback details for a user.
- **Parameters:**
  - `userId` (URL parameter): User's ID.
- **Response:**
  - 200 OK: Returns a success message.
  - 404 Not Found: If no active playback details exist for the specified user.

### Create Active Playback for a User

- **Endpoint:** `/api/active-playback/`
- **HTTP Method:** POST
- **Description:** Creates active playback details for a user when they start listening to a song.
- **Request Body:**
  - `user_id` (required): User's ID.
  - `song_id` (required): Song's ID.
  - `latitude` (required): Latitude of the playback location.
  - `longitude` (required): Longitude of the playback location.
- **Response:**
  - 201 Created: Returns the newly created active playback object with associated song and user details.
  - 500 Internal Server Error: If the active playback creation fails.

## Error Responses

- **400 Bad Request:**
  - Returned when the request parameters are invalid.
  - Example: `{ "error": "Invalid request parameters." }`
- **401 Unauthorized:**
  - Returned when the user is not authenticated to access the requested resource.
  - Example: `{ "error": "Unauthorized access." }`
- **403 Forbidden:**
  - Returned when the user does not have permission to access the requested resource.
  - Example: `{ "error": "Forbidden. Insufficient privileges." }`
- **500 Internal Server Error:**
  - Returned when an unexpected server error occurs.
  - Example: `{ "error": "Internal server error." }`

## Authentication

This API uses OAuth2 for authentication. Users need to authorize the app with their Spotify account to access certain endpoints.

---
## Deployment

https://ttp-capstone-backend.vercel.app/
