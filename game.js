import { formatTime } from "./utils.js";

export async function getGameInfo(gameTitle, clientId, accessToken, axios) {
  try {
    // First, search for the game to get its ID
    const gameResponse = await axios.post(
      "https://api.igdb.com/v4/games",
      `search "${gameTitle}"; fields name,checksum,id,game_modes,total_rating,rating,rating_count,status,storyline,summary,themes,total_rating,total_rating_count,genres; limit 1;`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "text/plain",
        },
      }
    );

    if (!gameResponse.data.length) {
      throw new Error("Game not found");
    }

    const fetchGenres = async (genreIds) => {
      try {
        const idsString = genreIds.join(","); // Convert array to a comma-separated string
        const response = await axios.post(
          "https://api.igdb.com/v4/genres",
          `fields id, name; where id = (${idsString});`,
          {
            headers: {
              "Client-ID": clientId,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Convert response to a mapping of ID to Name
        const genreMap = await response.data.reduce((acc, genre) => {
          acc[genre.id] = genre.name;
          return acc;
        }, {});

        console.log("Genre Map:", genreMap);
      } catch (error) {
        console.error(
          "Error fetching genres:",
          error.response?.data || error.message
        );
      }
    };

    // Example: Convert genre IDs [12, 31] to their names
    const genreNames = fetchGenres(gameResponse.data[0].genres);
    console.log(`💥 genreNames is: `, genreNames);

    const gameId = gameResponse.data[0].id;
    // Then get the completion time data
    const timeResponse = await axios.post(
      "https://api.igdb.com/v4/game_time_to_beats",
      `fields *; where game_id = ${gameId};`,
      {
        headers: {
          "Client-ID": clientId,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const time = formatTime(timeResponse.data[0].normally);

    return time || null;
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    throw error;
  }
}
