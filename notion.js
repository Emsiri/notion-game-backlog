export async function getGameInfoNotion(dbID, notion, gameTitle) {
  let gameInfo = {};
  try {
    const response = await notion.databases.query({
      database_id: dbID,
      filter: {
        property: "Game title",
        title: {
          equals: gameTitle,
        },
      },
    });
    if (response.results.length > 0) {
      // Object property assignment
      const pageId = response.results[0].id;
      const completion = response.results[0].properties["Completion"].number;
      const hoursPlayed = response.results[0].properties["Hours played"].number;
      const runsOnDeck =
        response.results[0].properties["Runs on Deck"].checkbox;
      const owned = response.results[0].properties["Owned"].checkbox;
      gameInfo.pageId = pageId;
      gameInfo.completion = completion;
      gameInfo.hoursPlayed = hoursPlayed;
      gameInfo.runsOnDeck = runsOnDeck;
      gameInfo.owned = owned;

      console.log("Page ID:", pageId);
      return gameInfo;
    } else {
      console.log("No matching page found.");
      return null;
    }
  } catch (error) {
    console.error("Error querying database:", error);
  }
}

export async function writeGameObjectToNotion(notion, dbID, gameObject) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: dbID },
      properties: gameObject,
    });

    console.log("Database entry created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating database entry:", error);
  }
}

export async function updateGameObjectToNotion(
  pageId,
  notion,
  updatedProperties
) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: updatedProperties,
    });
  } catch (error) {
    console.log(error);
  }
}
