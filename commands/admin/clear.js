const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { embedColor, adminRole } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Delete a number of messages from the current channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Number of messages to delete (1-100)')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction, client) {
    const amount = interaction.options.getInteger('amount');

    if (!interaction.member.roles.cache.has(adminRole)) {
      const noPermsEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('🚫 Access Denied')
        .setDescription('You do not have permission to use this command.');
      return interaction.reply({ embeds: [noPermsEmbed], ephemeral: true });
    }

    if (amount < 1 || amount > 100) {
      const invalidAmountEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('⚠️ Invalid Amount')
        .setDescription('Please provide a number between **1** and **100**.');
      return interaction.reply({ embeds: [invalidAmountEmbed], ephemeral: true });
    }

    try {
      const deletedMessages = await interaction.channel.bulkDelete(amount, true);

      const successEmbed = new EmbedBuilder()
        .setColor(embedColor)
        .setTitle('🧹 Messages Deleted')
        .setDescription(`Successfully deleted **${deletedMessages.size}** message(s).`)
        .setFooter({ text: `Moderator: ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.reply({ embeds: [successEmbed], ephemeral: true });

    } catch (error) {
      client.logger?.error(`❌ Clear Command Error: ${error.message}`);
      const errorEmbed = new EmbedBuilder()
        .setColor('Red')
        .setTitle('❌ Deletion Failed')
        .setDescription('An error occurred while trying to delete messages.');

      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  }
};
