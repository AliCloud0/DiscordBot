const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedColor, adminRole } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user to kick')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the kick')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.roles.cache.has(adminRole)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('🚫 Access Denied')
        .setDescription('You do not have permission to use this command.');
      return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);

      if (!member) {
        const notFoundEmbed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('⚠️ User Not Found')
          .setDescription('The specified user is not in the server.');
        return interaction.reply({ embeds: [notFoundEmbed], ephemeral: true });
      }

      if (!member.kickable) {
        const unkickableEmbed = new EmbedBuilder()
          .setColor('Red')
          .setTitle('⚠️ Cannot Kick User')
          .setDescription('I cannot kick this user. They may have a higher role or special permissions.');
        return interaction.reply({ embeds: [unkickableEmbed], ephemeral: true });
      }

      await member.kick(reason);

      const successEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('👢 User Kicked')
        .addFields(
          { name: '👤 User', value: `${user.tag} (${user.id})`, inline: false },
          { name: '📝 Reason', value: reason, inline: false },
          { name: '🔨 Kicked By', value: `${interaction.user.tag}`, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

    } catch (error) {
      client.logger?.error(`❌ Kick Command Error: ${error.message}`);
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Error Kicking User')
        .setDescription('An unexpected error occurred while trying to kick the user.');

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
