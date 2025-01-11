export async function getPageIdByTitle(dbID, notion, titleValue) {
  try {
    const response = await notion.databases.query({
      database_id: dbID,
      filter: {
        property: "Game title", // Replace 'Name' with the actual name of your title property
        title: {
          equals: titleValue,
        },
      },
    });

    if (response.results.length > 0) {
      console.log(`💥 response.results is: `, response.results[0].properties);
      const pageId = response.results[0].id;
      console.log("Page ID:", pageId);
      return pageId;
    } else {
      console.log("No matching page found.");
      return null;
    }
  } catch (error) {
    console.error("Error querying database:", error);
  }
  // const props = response.results.map((entries) => entries.properties);
  // const formattedProps = props.map(
  //   ({
  //     "Runs on Deck": deck,
  //     Owned,
  //     Genre,
  //     Completion,
  //     "Time to beat": time,
  //     "Game title": title,
  //     Status,
  //   }) => ({
  //     runsOnDeck: deck.checkbox,
  //     owned: Owned.checkbox,
  //     genre: Genre.rich_text[0]?.plain_text || "",
  //     completion: `${Completion.number}%`,
  //     timeToBeat: time.number,
  //     gameTitle: title.title[0] || "",
  //     gameTitleText: title.title[0].text || "",
  //     gameTitleAnnotations: title.title[0].annotations || "",
  //     status: Status.status.name,
  //   })
  // );

  // console.log(`💥 response is: `, formattedProps);
}

export async function addGameToBacklog(dbID, notion, gameObject) {
  try {
    const response = await notion.pages.update({
      page_id: pageId,
      properties: updatedProperties,
    });
  } catch (error) {
    console.log(error);
  }
}

// Update the specific property with a specific value,
// Make a switch statement that checks the property and changes the formatting to the correct format
// Maybe make it a general switch statement so that I can provide it as a utility to the add and udpate?
export async function updateGameInBacklog(pageId, notion, updatedProperties) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: updatedProperties,
    });
  } catch (error) {
    console.log(error);
  }
}
