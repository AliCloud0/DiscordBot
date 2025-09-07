const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { embedColor } = require('../../config/botConfig.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Show the avatar of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('Select a user (default: yourself)')
        .setRequired(false)
    ),

  async execute(interaction, client) {
    const user = interaction.options.getUser('user') || interaction.user;


    const avatarUrl = user.displayAvatarURL({ dynamic: true, size: 512 });
    const avatarUrlPNG = user.displayAvatarURL({ dynamic: false, size: 512, format: 'png' });
    const avatarUrlWEBP = user.displayAvatarURL({ dynamic: false, size: 512, format: 'webp' });
    const avatarUrlGIF = user.displayAvatarURL({ dynamic: true, size: 512, format: 'gif' });


    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`🖼️ Avatar of ${user.tag}`)
      .setDescription(`[Download PNG](${avatarUrlPNG}) | [Download WEBP](${avatarUrlWEBP})${avatarUrlGIF.endsWith('.gif') ? ` | [Download GIF](${avatarUrlGIF})` : ''}`)
      .setImage(avatarUrl)
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
      .setTimestamp();


    const row = new ActionRowBuilder()
      .addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('avatar_size_select')
          .setPlaceholder('Select avatar size')
          .addOptions([
            { label: '128 px', value: '128' },
            { label: '256 px', value: '256' },
            { label: '512 px', value: '512' },
            { label: '1024 px', value: '1024' },
            { label: '2048 px', value: '2048' },
          ])
      );


    await interaction.reply({ embeds: [embed], components: [row] });


    const collector = interaction.channel.createMessageComponentCollector({
      filter: i => i.user.id === interaction.user.id && i.customId === 'avatar_size_select',
      time: 60000
    });

    collector.on('collect', async i => {
      const size = parseInt(i.values[0]);
      const newAvatarUrl = user.displayAvatarURL({ dynamic: true, size });

      const newEmbed = EmbedBuilder.from(embed)
        .setImage(newAvatarUrl)
        .setDescription(`[Download PNG](${user.displayAvatarURL({ dynamic: false, size, format: 'png' })}) | [Download WEBP](${user.displayAvatarURL({ dynamic: false, size, format: 'webp' })})${avatarUrlGIF.endsWith('.gif') ? ` | [Download GIF](${user.displayAvatarURL({ dynamic: true, size, format: 'gif' })})` : ''}`);

      await i.update({ embeds: [newEmbed] });
    });

    collector.on('end', () => {
      interaction.editReply({ components: [] }).catch(() => {});
    });
  }
};
