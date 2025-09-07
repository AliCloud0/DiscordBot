const { EmbedBuilder } = require('discord.js');
const { embedColor } = require('../config/botConfig.json');

module.exports = {
  async execute(interaction, client) {

    const sendRateLimitMessage = async (msg) => {
      const embed = new EmbedBuilder()
        .setColor('#FF0000')
        .setDescription(msg);
      await interaction.reply({ embeds: [embed], ephemeral: true });
    };

    if (interaction.isChatInputCommand()) {
      if (!client.rateLimiter.check(interaction.user.id)) {
        return sendRateLimitMessage('⚠️ Please wait a moment! You are using commands too fast.');
      }

      const command = client.commands.get(interaction.commandName);

      if (!command) {
        return sendRateLimitMessage('❌ Command not found!');
      }

      try {
        await command.execute(interaction, client);
        client.logger?.info(`✅ Command executed: ${interaction.commandName} by ${interaction.user.tag}`);
      } catch (error) {
        client.logger?.error(`❌ Error executing command ${interaction.commandName}: ${error.message}`);
        await interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('#FF0000')
              .setDescription('🚨 An error occurred while executing the command!')
          ],
          ephemeral: true
        });
      }

    } else if (interaction.isButton()) {
      if (!client.rateLimiter.check(interaction.user.id)) {
        return sendRateLimitMessage('⚠️ Please wait a moment! You are clicking buttons too fast.');
      }


      if (interaction.customId.startsWith('poll_')) {
        const [_, choice] = interaction.customId.split('_');
        const embed = new EmbedBuilder()
          .setColor(embedColor)
          .setDescription(`✅ You voted for option **${choice}**!`);
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {

      }
    } else {

    }
  }
};
