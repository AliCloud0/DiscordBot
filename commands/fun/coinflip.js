const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin (Heads or Tails)'),

  async execute(interaction, client) {
    const flippingEmbed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle('🪙 Flipping the Coin...')
      .setDescription('Let\'s see what it lands on!');
    await interaction.reply({ embeds: [flippingEmbed] });


    setTimeout(async () => {
      const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
      const resultEmoji = result === 'Heads' ? '🙂' : '🐍';

      const resultEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('🪙 Coin Flip Result')
        .addFields(
          { name: 'Result', value: `**${result}** ${resultEmoji}`, inline: true },
          { name: 'Requested by', value: interaction.user.tag, inline: true }
        )
        .setTimestamp();

      await interaction.editReply({ embeds: [resultEmbed] });
    }, 1500);
  }
};
