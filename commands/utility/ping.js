const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check the bot\'s response time'),

  async execute(interaction, client) {
    await interaction.deferReply();


    const sentTimestamp = Date.now();
    const latency = sentTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(client.ws.ping);


    const getColor = (ms) => {
      if (ms < 100) return '#00FF00';
      if (ms < 200) return '#FFFF00';
      return '#FF0000';
    };

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('🏓 Pong!')
      .addFields(
        { name: '🤖 Bot Latency', value: `\`${latency} ms\``, inline: true },
        { name: '🌐 API Latency', value: `\`${apiLatency} ms\``, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    embed.setColor(getColor(latency));

    await interaction.editReply({ embeds: [embed] });
  }
};
