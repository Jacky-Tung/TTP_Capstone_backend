const { Playback, Song, User } = require("./db/models");
const db = require("./db/db");
const { faker } = require("@faker-js/faker");

const generateSongs = (count) => {
  const songs = [];
  for (let i = 0; i < count; i++) {
    const song_id = (i + 1).toString();
    const title = faker.music.songName();
    const artist = faker.person.fullName();
    const image_url = faker.image.avatar();
    const external_url = faker.image.avatar();

    songs.push({
      song_id,
      title,
      artist,
      image_url,
      external_url,
    });
  }
  return songs;
};

const generateUsers = (count) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    const user_id = (i + 1).toString();
    const display_name = faker.person.fullName();
    const email = faker.internet.email({
      firstName: display_name,
    });
    const password = faker.internet.password();
    const salt = faker.internet.password();

    users.push({
      user_id,
      display_name,
      email,
      password,
      salt,
    });
  }
  return users;
};

const generatePlayback = (count, songIds, userIds) => {
    const playbacks = [];
    for(let i = 0; i < count; i++){
        const playback_id = (i+1).toString();
        const latitude = faker.location.latitude();
        const longitude = faker.location.longitude();
        const songId = getRandomElement(songIds);
        const userId = getRandomElement(userIds);

        playbacks.push({
            playback_id,
            latitude,
            longitude,
            songId,
            userId,
        });
    }
    return playbacks;
}

const getRandomElement = (array) => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

const seed = async () => {
  await db.sync({ force: true });

  const seedSongs = generateSongs(10);
  const createdSongs = await Song.bulkCreate(seedSongs, {
    returning: true,
  });
  const songIds = createdSongs.map(song => song.song_id)
  console.log("Song Ids", songIds)

  const seedUsers = generateUsers(10);
  const createdUsers = await User.bulkCreate(seedUsers, {
    returning: true,
  });
  const userIds = createdUsers.map(user => user.user_id)
  console.log("User Ids", userIds);
  
  const seedPlayback = generatePlayback(10, songIds, userIds);
  await Playback.bulkCreate(seedPlayback);

  process.exit();
};

seed().catch((error) => {
  console.error("Seeding error:", error);
  process.exit(1);
});
