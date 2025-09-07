const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { embedColor } = require('../../config/botConfig.json');


const formatRelativeTime = (date) => `<t:${Math.floor(date.getTime() / 1000)}:R>`;


const statusEmojis = {
  online: '🟢 Online',
  idle: '🌙 Idle',
  dnd: '⛔ Do Not Disturb',
  offline: '⚫ Offline'
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('📜 Display detailed information about a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select a user (default: yourself)')
        .setRequired(false)
    ),

  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    const joinedDate = member?.joinedAt ? formatRelativeTime(member.joinedAt) : '❌ Not in this server';
    const createdDate = formatRelativeTime(user.createdAt);


    const presence = member?.presence?.status || 'offline';
    const statusText = statusEmojis[presence] || '❓ Unknown';


    const roles = member?.roles.cache
      .filter(r => r.id !== interaction.guild.id)
      .map(r => r.toString())
      .join(', ') || '❌ No roles';


    const flags = (await user.fetchFlags()).toArray();
    const badgeList = flags.length > 0 ? flags.join(', ') : '❌ No badges';


    const embed = new EmbedBuilder()
      .setColor(embedColor || 0x5865F2)
      .setAuthor({ name: `👤 User Information: ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .addFields(
        { name: '🆔 User ID', value: `\`${user.id}\``, inline: true },
        { name: '📅 Account Created', value: createdDate, inline: true },
        { name: '📅 Joined Server', value: joinedDate, inline: true },
        { name: '📡 Status', value: statusText, inline: true },
        { name: '🏷️ Roles', value: roles, inline: false },
        { name: '🎖️ Badges', value: badgeList, inline: false },
        { name: '🤖 Bot?', value: user.bot ? '✅ Yes' : '❌ No', inline: true }
      )
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
