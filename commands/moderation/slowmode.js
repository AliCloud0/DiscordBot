const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedColor, adminRole } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set the slowmode duration for the current channel')
    .addIntegerOption(option =>
      option.setName('seconds')
        .setDescription('Slowmode duration in seconds (0 to disable)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {

    if (!interaction.member.roles.cache.has(adminRole)) {
      const noPermEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('🚫 Access Denied')
        .setDescription('You do not have permission to use this command.');
      return interaction.reply({ embeds: [noPermEmbed], ephemeral: true });
    }

    const seconds = interaction.options.getInteger('seconds');

    // Validate input range (Discord max slowmode is 21600 seconds = 6 hours)
    if (seconds < 0 || seconds > 21600) {
      const invalidEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('⚠️ Invalid Duration')
        .setDescription('Slowmode must be between 0 and 21,600 seconds (6 hours).');
      return interaction.reply({ embeds: [invalidEmbed], ephemeral: true });
    }

    try {
      await interaction.channel.setRateLimitPerUser(seconds);

      const successEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('⏲️ Slowmode Updated')
        .setDescription(seconds === 0 
          ? 'Slowmode has been disabled for this channel.' 
          : `Slowmode has been set to **${seconds} second(s)**.`)
        .setFooter({ text: `Updated by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });
    } catch (error) {
      client.logger?.error(`❌ Slowmode Command Error: ${error.message}`);

      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Error Setting Slowmode')
        .setDescription('An error occurred while trying to set the slowmode for this channel.')
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
