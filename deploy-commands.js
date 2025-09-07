//https://github.com/AliCloud0
require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs').promises;
const path = require('path');
const Logger = require('./utils/Logger');

const logger = new Logger();

const deployCommands = async () => {
  try {
    const commands = [];
    const commandsPath = path.join(__dirname, 'commands');
    const categories = await fs.readdir(commandsPath);

    for (const category of categories) {
      const categoryPath = path.join(commandsPath, category);
      const commandFiles = (await fs.readdir(categoryPath)).filter(file => file.endsWith('.js'));

      for (const file of commandFiles) {
        const filePath = path.join(categoryPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
          commands.push(command.data.toJSON());
          logger.info(`✅ Prepared command: ${command.data.name}`);
        } else {
          logger.warn(`⚠️ Skipped invalid command file: ${file}`);
        }
      }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    logger.info('🚀 Started refreshing application (/) commands...');

    const isGlobal = false;
    if (isGlobal) {
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
      logger.info('🌍 Successfully reloaded global application (/) commands.');
    } else {
      await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });
      logger.info('🏰 Successfully reloaded guild application (/) commands.');
    }

  } catch (error) {
    logger.error(`❌ Failed to deploy commands: ${error.stack || error.message}`);
    process.exit(1);
};

deployCommands();
