import { Client } from "@notionhq/client";
import axios from "axios";
import { getGameInfo } from "./game.js";
import {
  getPageIdByTitle,
  addGameToBacklog,
  updateGameInBacklog,
} from "./notion.js";
import { updateProperties } from "./properties.js";
import dotenv from "dotenv";

dotenv.config();

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const token = process.env.TOKEN;
const dbID = process.env.DB_ID;

const notion = new Client({
  auth: token,
});

const gameObject = {};

// TODO convert to imports and modules

getPageIdByTitle(dbID, notion, "Ghost Runner");
// addGameToBacklog(dbID, notion);

// Add a script that takes the entry from above and searches for the game on how long to beat

// const updatedProperties = {
//   // Update properties based on your database schema
//   Status: {
//     status: {
//       name: "In progress",
//     },
//   },
// };

const runQuery = async (gameObject) => {
  // const { data } = await axios.post(
  //   `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
  // );
  // const times = await getGameInfo(
  //   "Elden Ring",
  //   clientId,
  //   data.access_token,
  //   axios
  // );

  const gameId = await getPageIdByTitle(dbID, notion, "Ghost Runner");

  // const updatedProperties = updateProperties("status", "Not playing");
  const updatedProperties = updateProperties("completion", 0);

  const response = await updateGameInBacklog(gameId, notion, updatedProperties);
  console.log(`💥 response is: `, response);

  // console.log(times);
};

runQuery();

// Working

// const fetchGameTimeToBeat = async (gameId) => {
//   try {
//     const { data } = await axios.post(
//       `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
//     );
//     console.log(`💥 data.access_token is: `, data.access_token);
// const response = await axios.post(
//   "https://api.igdb.com/v4/game_time_to_beats",
//   `fields *; where game_id = ${gameId};`,
//   {
//     headers: {
//       "Client-ID": clientId,
//       Authorization: `Bearer ${data.access_token}`,
//     },
//   }
// );

//     console.log("Game Time to Beat:", response.data);
//   } catch (error) {
//     console.error(
//       "Error fetching game time to beat:",
//       error.response?.data || error.message
//     );
//   }
// };

// Make a update script to update progress on games

// Figure out how to make this all generic enough to work on books, movies and tv shows dbs

// if book {dbid = 'xxxx', props = xxx,yyy,zzz, etc}

// Turn the thing into a CLI app

// Create a script that sorts and gets the game with the least hours to complete to start

// Figure out how to deploy it as a webapp / integration with Notion
