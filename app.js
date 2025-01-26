import { Client } from "@notionhq/client";
import axios from "axios";
import { getGameInfo } from "./game.js";
import {
  getGameInfoNotion,
  retrieveNotes,
  updateGameObjectToNotion,
  updateNote,
  writeGameObjectToNotion,
} from "./notion.js";
import { updateProperties } from "./properties.js";
import dotenv from "dotenv";
import dayjs from "dayjs";

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

export async function updateGameNotes(gameTitle, note) {
  const gameInfo = await getGameInfoNotion(dbID, notion, gameTitle);
  const response = await retrieveNotes(gameInfo.pageId, notion);
  const currentNote = response.properties.Notes.rich_text?.length
    ? response.properties.note.rich_text
        .map((item) => item.text.content)
        .join("")
    : "";
  // Generate a timestamp
  const timestamp = dayjs().format("YYYY-MM-DD HH:mm:ss");

  // Combine the current notes with the new note
  const updatedNote = `${currentNote}${
    currentNote ? "\n" : ""
  }[${timestamp}] ${note}`;
  try {
    await updateNote(gameInfo.pageId, notion, updatedNote);
  } catch (error) {
    console.log("Error updating note: ", error);
  }
}

// TODO Mark a game as finished, update the status and set the hours played time to time to beat so completion = 100%

// Figure out how to make this all generic enough to work on books, movies and tv shows dbs

// if book {dbid = 'xxxx', props = xxx,yyy,zzz, etc}

// Figure out how to deploy it as a webapp / integration with Notion
