#!/usr/bin/env node

import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import {
  addGameToBacklog,
  updateGameInBacklog,
  updateGameNotes,
} from "./app.js";

const program = new Command();

program
  .name("game-backlog-cli")
  .description(chalk.cyanBright("A CLI tool to manage your game backlog"))
  .version("1.0.0");

// Add a game to the backlog
// TODO tweak the Add game backlog property to ask questions about owned, status and runs on deck and set those properties at once
// Also have an optional Notes question to set a note when adding (platform, who recommended it, why, etc)
program
  .command("add")
  .description("Add a new game to your backlog")
  .action(async () => {
    const { title } = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "Enter the game title to add:",
        validate: (input) => (input ? true : "Game title cannot be empty"),
      },
    ]);

    console.log(chalk.green(`Adding "${title}" to your backlog...`));
    await addGameToBacklog(title); // Call your existing function
    console.log(chalk.green("Game added successfully!"));
  });

// Update a game in the backlog
program
  .command("update")
  .description("Update an existing game in your backlog")
  .action(async () => {
    const { gameTitle } = await inquirer.prompt([
      {
        type: "input",
        name: "gameTitle",
        message: "Enter the game title to update:",
        validate: (input) => (input ? true : "Game title cannot be empty"),
      },
    ]);

    const { property } = await inquirer.prompt([
      {
        type: "list",
        name: "property",
        message: "What is the property you would like to change?",
        choices: [
          "Status",
          "Hours played",
          "Owned",
          "Runs on deck",
          "Game title",
        ],
      },
    ]);

    // Define input types for different properties
    let inputPrompt = {};
    switch (property) {
      case "Hours played":
        inputPrompt = {
          type: "number",
          name: "value",
          message: `Enter the number of hours played:`,
          validate: (input) =>
            input >= 0 ? true : "Hours played must be a non-negative number",
        };
        break;
      case "Owned":
        inputPrompt = {
          type: "confirm",
          name: "value",
          message: `Do you own this game?`,
        };
        break;
      case "Status":
        inputPrompt = {
          type: "list",
          name: "value",
          message: `What status would you like to change to?`,
          choices: [
            "In progress",
            "Shelved",
            "Not playing",
            "Abandoned",
            "Done",
          ],
        };
        break;
      // Figure out how to retrieve this info from protonDB
      case "Runs on deck":
        inputPrompt = {
          type: "confirm",
          name: "value",
          message: `Does this game run on the steam deck?`,
        };
        break;
      default:
        inputPrompt = {
          type: "input",
          name: "value",
          message: `Enter the new value for ${property}:`,
          validate: (input) => (input ? true : `${property} cannot be empty`),
        };
        break;
    }

    const { value } = await inquirer.prompt([inputPrompt]);

    console.log(
      chalk.blue(
        `Updating "${gameTitle}" - Changing "${property}" to "${value}" in your backlog...`
      )
    );

    await updateGameInBacklog(gameTitle, property, value); // Update function call

    console.log(
      chalk.green(`✨ ${gameTitle} has been successfully updated! ✨`)
    );
  });

// Add a game to the backlog
program
  .command("note")
  .description("Add a new note to a game in the backlog")
  .action(async () => {
    const { gameTitle } = await inquirer.prompt([
      {
        type: "input",
        name: "gameTitle",
        message: "Enter the game title to add a note to",
        validate: (input) => (input ? true : "Game title cannot be empty"),
      },
    ]);
    const { note } = await inquirer.prompt([
      {
        type: "input",
        name: "note",
        message: "Enter the game note",
        validate: (input) => (input ? true : "Game note cannot be empty"),
      },
    ]);

    console.log(chalk.blue(`Adding the note to ${gameTitle}`));
    await updateGameNotes(gameTitle, note); // Call your existing function
    console.log(chalk.green("✨ Note added successfully! ✨"));
  });

program.parse(process.argv);
