function updateProperties(property, value) {
  switch (property) {
    case "status":
      return {
        Status: {
          status: {
            name: value,
          },
        },
      };
    case "completion":
      return {
        Completion: {
          number: value,
        },
      };
    default:
      throw new Error(`Property not in list, send either status, etc`);
  }
}

module.exports = { updateProperties };
