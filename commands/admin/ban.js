const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedColor, adminRole } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban a user from the server.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select the user you want to ban.')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the ban.')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    if (!interaction.member.roles.cache.has(adminRole)) {
      const noPermissionEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Insufficient Permissions')
        .setDescription('You do not have the required permissions to use this command.');
      return interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
    }

    try {
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('⚠️ User Not Found')
              .setDescription(`The specified user could not be found in this server.`)
          ],
          ephemeral: true
        });
      }

      if (!member.bannable) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setColor('Red')
              .setTitle('⚠️ Cannot Ban User')
              .setDescription(`I cannot ban this user. They may have a higher role or admin permissions.`)
          ],
          ephemeral: true
        });
      }

      await member.ban({ reason });

      const successEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('🚫 User Banned')
        .addFields(
          { name: '👤 User', value: `${user.tag} (${user.id})`, inline: false },
          { name: '📝 Reason', value: reason, inline: false },
          { name: '🔨 Banned By', value: `${interaction.user.tag}`, inline: false }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed] });

    } catch (error) {
      client.logger?.error(`❌ Ban Command Error: ${error.message}`);
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Error Banning User')
        .setDescription(`An unexpected error occurred while trying to ban the user.`);

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
