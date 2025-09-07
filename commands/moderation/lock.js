const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedColor, adminRole } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('Lock the current channel to prevent messages')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

  async execute(interaction, client) {

    if (!interaction.member.roles.cache.has(adminRole)) {
      const noPermEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('🚫 Access Denied')
        .setDescription('You do not have permission to use this command.');
      return interaction.reply({ embeds: [noPermEmbed], ephemeral: true });
    }

    try {
      await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false
      });

      const successEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('🔒 Channel Locked')
        .setDescription('This channel has been successfully locked. Members cannot send messages now.')
        .setTimestamp()
        .setFooter({ text: `Locked by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

      await interaction.reply({ embeds: [successEmbed] });
    } catch (error) {
      client.logger?.error(`❌ Lock Command Error: ${error.message}`);

      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Error Locking Channel')
        .setDescription('An error occurred while trying to lock this channel.')
        .setTimestamp();

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
