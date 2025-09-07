const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { adminRole } = require('../../config/botConfig.json');
const goodMode = require('../../storage/goodMode');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('good')
    .setDescription('Enable or disable the good mode filter')
    .addBooleanOption(option =>
      option.setName('state')
        .setDescription('true = enable filter, false = disable')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.member.roles.cache.has(adminRole)) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription('🚫 You do not have permission to use this command.')
        ],
        ephemeral: true
      });
    }

    const state = interaction.options.getBoolean('state');
    goodMode.setGoodMode(state);

    const embed = new EmbedBuilder()
      .setColor(state ? 'Green' : 'Orange')
      .setDescription(state ? '✅ Good mode filter is now **ENABLED**.' : '⚠️ Good mode filter is now **DISABLED**.');

    await interaction.reply({ embeds: [embed] });
  }
};
