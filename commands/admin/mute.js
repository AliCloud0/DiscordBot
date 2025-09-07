const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedColor, adminRole } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Temporarily mute a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user to mute')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('Mute duration in minutes')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the mute')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.roles.cache.has(adminRole)) {
      const noPermsEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('🚫 Access Denied')
        .setDescription('You do not have permission to use this command.');
      return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
    }

    if (duration < 1 || duration > 10080) {
      const invalidTimeEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('⚠️ Invalid Duration')
        .setDescription('Mute duration must be between **1** and **10080** minutes.');
      return interaction.reply({ embeds: [invalidTimeEmbed], ephemeral: true });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (!member) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('⚠️ User Not Found')
              .setDescription('The specified user could not be found in this server.')
          ],
          ephemeral: true
        });
      }

      if (!member.moderatable) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('⚠️ Cannot Mute User')
              .setDescription('I do not have permission to mute this user.')
          ],
          ephemeral: true
        });
      }

      const durationMs = duration * 60 * 1000;
      await member.timeout(durationMs, reason);

      const successEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('🔇 User Muted')
        .addFields(
          { name: '👤 User', value: `${user.tag} (${user.id})`, inline: false },
          { name: '🕒 Duration', value: `${duration} minute(s)`, inline: false },
          { name: '📝 Reason', value: reason, inline: false },
          { name: '🔨 Muted By', value: interaction.user.tag, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

    } catch (error) {
      client.logger?.error(`❌ Mute Command Error: ${error.message}`);
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Error Muting User')
        .setDescription('An unexpected error occurred while trying to mute the user.');
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
