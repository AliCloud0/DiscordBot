const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls a dice with a specified number of sides')
    .addIntegerOption(option =>
      option.setName('sides')
        .setDescription('Number of sides on the dice (default: 6)')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const sides = interaction.options.getInteger('sides') || 6;

    if (sides < 2 || sides > 1000) {
      const errorEmbed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('❌ Dice must have between 2 and 1000 sides!');
      return interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }

    const result = Math.floor(Math.random() * sides) + 1;

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('🎲 Dice Roll')
      .addFields(
        { name: 'Sides', value: `${sides}`, inline: true },
        { name: 'Result', value: `**${result}**`, inline: true }
      )
      .setFooter({ text: `Rolled by ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
