const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Verwalte deine Embeds')
    .addSubcommand(subcommand =>
        subcommand
            .setName('create')
            .setDescription('Erstelle ein neues Embed')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('send')
            .setDescription('Sende ein Embed')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('Der Name des Embeds')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
            .addChannelOption(option =>
                option
                    .setName('channel')
                    .setDescription('Der Channel, in dem das Embed gesendet werden soll')
                    .setRequired(false)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('edit')
            .setDescription('Bearbeite ein Embed')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('Der Name des Embeds')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('delete')
            .setDescription('Lösche ein Embed')
            .addStringOption(option =>
                option
                    .setName('name')
                    .setDescription('Der Name des Embeds')
                    .setRequired(true)
                    .setAutocomplete(true)
            )
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('list')
            .setDescription('Liste alle Embeds auf')
    ),

async execute(interaction) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'create') {
            const firstEmbed = new EmbedBuilder()
                .setColor("#00a5ff")
                .setTitle("Example Embed")
                .setDescription("This is an example embed")

            const firstRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('title').setLabel('Edit Title').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('author').setLabel('Edit Author').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('description').setLabel('Edit Description').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary)
            );

            const secondRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('color').setLabel('Edit Color').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('timestamp').setLabel('Edit Timestamp').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('fields').setLabel('Edit Fields').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
            );

            const thirdRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('thumbnail').setLabel('Edit Thumbnail').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('image').setLabel('Edit Image').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('footer').setLabel('Edit Footer').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
            );

            const fourthRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('send').setLabel('Send').setEmoji("<:yes:1339284921675546744>").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('export-json').setLabel('Export JSON').setEmoji("📑").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('import-json').setLabel('Import JSON').setEmoji("📑").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('cancle').setLabel('Cancel').setEmoji("<:no:1339284919959945226>").setStyle(ButtonStyle.Danger),
            );

            await interaction.reply({ 
                content: `**Embed Creator** - Bearbeite dein Embed mit den Buttons unten:`, 
                embeds: [firstEmbed], 
                components: [firstRow, secondRow, thirdRow, fourthRow]
            });
        }
        else if (subcommand === 'send') {
            const embedName = interaction.options.getString('name');
            const channel = interaction.options.getChannel('channel') || interaction.channel;
            
            const embedsFilePath = path.join(__dirname, '../../Database/embeds.json');
            
            if (!fs.existsSync(embedsFilePath)) {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const fileContent = fs.readFileSync(embedsFilePath, 'utf8');
            if (!fileContent || fileContent.trim() === '') {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const embeds = JSON.parse(fileContent);
            
            if (!embeds[embedName]) {
                return interaction.reply({ content: `Embed "${embedName}" not found!`, ephemeral: true });
            }
            
            const embed = new EmbedBuilder(embeds[embedName]);
            
            await channel.send({ embeds: [embed] });
            
            await interaction.reply({ content: `Embed "${embedName}" sent to ${channel}!`, ephemeral: true });
        }
        else if (subcommand === 'edit') {
            const embedName = interaction.options.getString('name');
            
            const embedsFilePath = path.join(__dirname, '../../Database/embeds.json');
            
            if (!fs.existsSync(embedsFilePath)) {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const fileContent = fs.readFileSync(embedsFilePath, 'utf8');
            if (!fileContent || fileContent.trim() === '') {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const embeds = JSON.parse(fileContent);
            
            if (!embeds[embedName]) {
                return interaction.reply({ content: `Embed "${embedName}" not found!`, ephemeral: true });
            }
            
            const embed = new EmbedBuilder(embeds[embedName]);
            
            const firstRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('title').setLabel('Edit Title').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('author').setLabel('Edit Author').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('description').setLabel('Edit Description').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary)
            );

            const secondRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('color').setLabel('Edit Color').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('timestamp').setLabel('Edit Timestamp').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('fields').setLabel('Edit Fields').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
            );

            const thirdRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('thumbnail').setLabel('Edit Thumbnail').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('image').setLabel('Edit Image').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('footer').setLabel('Edit Footer').setEmoji("<:Pen:1341077207723937802>").setStyle(ButtonStyle.Secondary),
            );

            const fourthRow = new ActionRowBuilder().setComponents(
                new ButtonBuilder().setCustomId('send').setLabel('Send').setEmoji("<:yes:1339284921675546744>").setStyle(ButtonStyle.Success),
                new ButtonBuilder().setCustomId('export-json').setLabel('Export JSON').setEmoji("📑").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('import-json').setLabel('Import JSON').setEmoji("📑").setStyle(ButtonStyle.Primary),
                new ButtonBuilder().setCustomId('cancle').setLabel('Cancel').setEmoji("<:no:1339284919959945226>").setStyle(ButtonStyle.Danger),
            );
            
            await interaction.reply({ 
                content: `**Embed Creator** - Bearbeite das Embed "${embedName}":`,
                embeds: [embed], 
                components: [firstRow, secondRow, thirdRow, fourthRow]
            });
        }
        else if (subcommand === 'delete') {
            const embedName = interaction.options.getString('name');
            
            const embedsFilePath = path.join(__dirname, '../../Database/embeds.json');
            
            if (!fs.existsSync(embedsFilePath)) {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const fileContent = fs.readFileSync(embedsFilePath, 'utf8');
            if (!fileContent || fileContent.trim() === '') {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const embeds = JSON.parse(fileContent);
            
            if (!embeds[embedName]) {
                return interaction.reply({ content: `Embed "${embedName}" not found!`, ephemeral: true });
            }
            
            delete embeds[embedName];
            
            fs.writeFileSync(embedsFilePath, JSON.stringify(embeds, null, 2));
            
            await interaction.reply({ content: `Embed "${embedName}" deleted!`, ephemeral: true });
        }
        else if (subcommand === 'list') {
            const embedsFilePath = path.join(__dirname, '../../Database/embeds.json');
            
            if (!fs.existsSync(embedsFilePath)) {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const fileContent = fs.readFileSync(embedsFilePath, 'utf8');
            if (!fileContent || fileContent.trim() === '') {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const embeds = JSON.parse(fileContent);
            
            if (Object.keys(embeds).length === 0) {
                return interaction.reply({ content: 'No embeds found!', ephemeral: true });
            }
            
            const listEmbed = new EmbedBuilder()
                .setColor("#00a5ff")
                .setTitle("Saved Embeds")
                .setDescription("Here are all your saved embeds:");
            
            Object.keys(embeds).forEach(name => {
                const embed = embeds[name];
                listEmbed.addFields({
                    name: name,
                    value: `Title: ${embed.title || 'None'}\nDescription: ${embed.description ? (embed.description.length > 50 ? embed.description.substring(0, 50) + '...' : embed.description) : 'None'}`
                });
            });
            
            await interaction.reply({ embeds: [listEmbed], ephemeral: true });
        }
    }
};

module.exports.autocomplete = async (interaction) => {
    const focusedOption = interaction.options.getFocused(true);
    
    if (focusedOption.name === 'name') {
        const embedsFilePath = path.join(__dirname, '../../Database/embeds.json');
        
        if (!fs.existsSync(embedsFilePath)) {
            return interaction.respond([]);
        }
        
        const fileContent = fs.readFileSync(embedsFilePath, 'utf8');
        if (!fileContent || fileContent.trim() === '') {
            return interaction.respond([]);
        }
        
        const embeds = JSON.parse(fileContent);
        
        if (Object.keys(embeds).length === 0) {
            return interaction.respond([]);
        }
        
        const filtered = Object.keys(embeds)
            .filter(name => name.toLowerCase().includes(focusedOption.value.toLowerCase()))
            .map(name => ({ name, value: name }));
        
        await interaction.respond(filtered);
    }
};
