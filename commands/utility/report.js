const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require('discord.js');
const { reportLogChannelId, embedColor } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('report')
    .setDescription('📣 Report a user to the server staff')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('🔍 Select the user you want to report')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('📝 Provide the reason for the report')
        .setRequired(true)
    ),

  async execute(interaction) {
    const reportedUser = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason');

  
  
  

    if (reportedUser.id === interaction.user.id)
      return interaction.reply({ content: "❌ You can't report yourself.", ephemeral: true });

    if (reportedUser.bot)
      return interaction.reply({ content: "❌ You can't report a bot.", ephemeral: true });

    const logChannel = interaction.guild.channels.cache.get(reportLogChannelId);
    if (!logChannel)
      return interaction.reply({ content: '❌ Report log channel not found in config.', ephemeral: true });


    const reportEmbed = new EmbedBuilder()
      .setColor(embedColor || '#FF0055')
      .setTitle('🚨 New User Report Received')
      .setThumbnail(reportedUser.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '👤 Reported User', value: `${reportedUser} | \`${reportedUser.tag}\``, inline: false },
        { name: '🧑‍💼 Reporter', value: `${interaction.user} | \`${interaction.user.tag}\``, inline: false },
        { name: '📄 Reason', value: reason, inline: false },
        { name: '🕒 Time', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: false }
      )
      .setFooter({ text: `User ID: ${reportedUser.id} • Reporter ID: ${interaction.user.id}` })
      .setTimestamp();

    await logChannel.send({ embeds: [reportEmbed] });


    await interaction.reply({
      content: `✅ Your report against **${reportedUser.tag}** has been submitted.`,
      ephemeral: true
    });
  }
};
