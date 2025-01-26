export function updateProperties(gameObject, property, value, hoursPlayed) {
  switch (property) {
    case "Game title":
      gameObject["Game title"] = {
        title: [
          {
            text: { content: value, link: null },
          },
        ],
      };
      break;
    case "Status":
      gameObject["Status"] = {
        status: {
          name: value,
        },
      };
      break;
    case "Completion":
      gameObject["Completion"] = {
        number: value,
      };
      break;
    case "Hours played":
      gameObject["Hours played"] = {
        number: +hoursPlayed + +value,
      };
      break;
    case "Time to beat":
      gameObject["Time to beat"] = {
        number: value,
      };
      break;
    case "Owned":
      gameObject["Owned"] = {
        checkbox: value,
      };
      break;
    case "Runs on deck":
      gameObject["Runs on Deck"] = {
        checkbox: value,
      };
      break;
    case "Genre":
      gameObject["Genre"] = {
        rich_text: [
          {
            text: { content: value, link: null },
          },
        ],
      };
      break;
    default:
      throw new Error(`Property not in list, send either status, etc`);
  }
}
