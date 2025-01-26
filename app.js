import { Client } from "@notionhq/client";
import axios from "axios";
import { getGameInfo } from "./game.js";
import {
  getGameInfoNotion,
  updateGameObjectToNotion,
  writeGameObjectToNotion,
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

export async function addGameToBacklog(gameTitle) {
  const { data } = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`
  );
  const accessToken = data.access_token;
  let gameObject = await getGameInfo(gameTitle, clientId, accessToken, axios);
  (gameObject.Status = {
    status: {
      name: "Not playing",
    },
  }),
    (gameObject.Completion = {
      number: 0,
    });
  gameObject["Hours played"] = {
    number: 0,
  };
  await writeGameObjectToNotion(notion, dbID, gameObject);
}

export async function updateGameInBacklog(gameTitle, property, value) {
  const gameInfo = await getGameInfoNotion(dbID, notion, gameTitle);
  let updateGameObject = {};
  updateProperties(updateGameObject, property, value, gameInfo.hoursPlayed);
  await updateGameObjectToNotion(gameInfo.pageId, notion, updateGameObject);
}

// Figure out how to make this all generic enough to work on books, movies and tv shows dbs

// if book {dbid = 'xxxx', props = xxx,yyy,zzz, etc}

// Figure out how to deploy it as a webapp / integration with Notion
