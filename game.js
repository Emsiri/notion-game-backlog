import { formatTime } from "./utils.js";

// Break these out into separate function calls and compose them into app to use in cli

// TODO change to object params with names
// Update to TS

const fetchGenres = async (genreIds, axios, clientId, accessToken) => {
  try {
    const idsString = genreIds.join(","); // Convert array to a comma-separated string
    const { data: genreResponse } = await axios.post(
      "https://api.igdb.com/v4/genres",
      `fields id, name; where id = (${idsString});`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const genreList = await genreResponse.map((genre) => {
      return genre.name;
    });

    return genreList.toString();
  } catch (error) {
    console.error(
      "Error fetching genres:",
      error.response?.data || error.message
    );
  }
};

export async function getGameInfo(gameTitle, clientId, accessToken, axios) {
  let gameInfo = {};
  try {
    const { data: gameResponse } = await axios.post(
      "https://api.igdb.com/v4/games",
      `search "${gameTitle}"; fields name,id,genres; limit 1;`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "text/plain",
        },
      }
    );

    gameInfo["Game title"] = {
      title: [
        {
          text: {
            content: gameResponse[0].name,
          },
        },
      ],
    };

    if (!gameResponse.length) {
      throw new Error("Game not found");
    }

    // Example: Convert genre IDs [12, 31] to their names
    const genreNames = await fetchGenres(
      gameResponse[0].genres,
      axios,
      clientId,
      accessToken
    );

    gameInfo.Genre = {
      rich_text: [
        {
          text: {
            content: genreNames,
          },
        },
      ],
    };

    const gameId = gameResponse[0].id;
    // Get the time to beat for the game
    // TODO pull out as a separate func
    const { data: timeResponse } = await axios.post(
      "https://api.igdb.com/v4/game_time_to_beats",
      `fields *; where game_id = ${gameId};`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const time = formatTime(timeResponse[0].normally);
    gameInfo["Time to beat"] = {
      number: time,
    };

    return gameInfo || null;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}
