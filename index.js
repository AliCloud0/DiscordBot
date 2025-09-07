//https://github.com/AliCloud0

require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const Logger = require('./utils/Logger');
const RateLimiter = require('./utils/RateLimiter');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
  ],
});

client.commands = new Collection();
client.logger = new Logger();
client.rateLimiter = new RateLimiter(5, 10000); 
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Bot is running!");
});

app.listen(3000, () => {
  console.log("🌐 Express server started on port 3000");
});

async function loadCommands() {
  const start = Date.now();
  const commandsPath = path.resolve(__dirname, 'commands');
  const categories = await fs.readdir(commandsPath);

  for (const category of categories) {
    const categoryPath = path.resolve(commandsPath, category);
    let commandFiles = [];
    try {
      commandFiles = (await fs.readdir(categoryPath)).filter(file => file.endsWith('.js'));
    } catch (e) {
      client.logger.warn(`Could not read command category folder ${category}: ${e.message}`);
      continue;
    }

    for (const file of commandFiles) {
      const filePath = path.resolve(categoryPath, file);
      try {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
          client.commands.set(command.data.name, command);
          client.logger.info(`✅ Loaded command: ${command.data.name} from category: ${category}`);
        } else {
          client.logger.warn(`⚠️ Command file missing data or execute: ${filePath}`);
        }
      } catch (error) {
        client.logger.error(`Failed to load command at ${filePath}: ${error.stack || error.message}`);
      }
    }
  }
  const end = Date.now();
  client.logger.info(`🕒 Loaded all commands in ${(end - start)}ms`);
}

async function loadEvents() {
  const start = Date.now();
  const eventsPath = path.resolve(__dirname, 'events');
  let eventFiles = [];
  try {
    eventFiles = (await fs.readdir(eventsPath)).filter(file => file.endsWith('.js'));
  } catch (e) {
    client.logger.error(`Could not read events folder: ${e.message}`);
    return;
  }

  for (const file of eventFiles) {
    const filePath = path.resolve(eventsPath, file);
    try {
      const event = require(filePath);
      const eventName = file.split('.')[0];
      if (event.once) {
        client.once(eventName, (...args) => event.execute(...args, client));
      } else {
        client.on(eventName, (...args) => event.execute(...args, client));
      }
      client.logger.info(`✅ Loaded event: ${eventName}`);
    } catch (error) {
      client.logger.error(`Failed to load event at ${filePath}: ${error.stack || error.message}`);
    }
  }
  const end = Date.now();
  client.logger.info(`🕒 Loaded all events in ${(end - start)}ms`);
}

(async () => {
  try {
    await loadEvents();
    await loadCommands();
    await client.login(process.env.TOKEN);
    client.logger.info('🚀 Bot successfully logged in!');
  } catch (error) {
    client.logger.error(`❌ Failed to start bot: ${error.stack || error.message}`);
    process.exit(1);
  }
})();
