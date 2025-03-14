const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    once: false,
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                return interaction.reply({ content: "Dieser Command ist nicht mehr Gültig!" });
            }
            command.execute(interaction, client);
        };

        if (interaction.isButton()) {
            const buttonId = interaction.customId;
            
            if (['title', 'author', 'description', 'color', 'timestamp', 'fields', 'thumbnail', 'image', 'footer'].includes(buttonId)) {
                handleEmbedCreatorButton(interaction, buttonId);
            } else if (buttonId === 'send') {
                handleSendEmbed(interaction);
            } else if (buttonId === 'export-json') {
                handleExportJson(interaction);
            } else if (buttonId === 'import-json') {
                handleImportJson(interaction);
            } else if (buttonId === 'cancle') {
                handleCancelEmbed(interaction);
            }
        }

        if (interaction.isModalSubmit()) {
            const modalId = interaction.customId;
            
            if (modalId.startsWith('embed_')) {
                handleEmbedModalSubmit(interaction);
            } else if (modalId === 'send_embed_modal') {
                handleSendEmbedModalSubmit(interaction);
            } else if (modalId === 'import_json_modal') {
                handleImportJsonModalSubmit(interaction);
            }
        }
    },
};

async function handleEmbedCreatorButton(interaction, buttonId) {
    const modal = new ModalBuilder()
        .setCustomId(`embed_${buttonId}`)
        .setTitle(`Edit ${buttonId.charAt(0).toUpperCase() + buttonId.slice(1)}`);
    
    if (buttonId === 'title') {
        const titleInput = new TextInputBuilder()
            .setCustomId('title_input')
            .setLabel('Title')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the title for your embed')
            .setRequired(true)
            .setMaxLength(256);
        
        modal.addComponents(new ActionRowBuilder().addComponents(titleInput));
    } 
    else if (buttonId === 'author') {
        const authorNameInput = new TextInputBuilder()
            .setCustomId('author_name_input')
            .setLabel('Author Name')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the author name')
            .setRequired(true)
            .setMaxLength(256);
        
        const authorIconInput = new TextInputBuilder()
            .setCustomId('author_icon_input')
            .setLabel('Author Icon URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the URL for the author icon')
            .setRequired(false)
            .setMaxLength(1024);
        
        const authorUrlInput = new TextInputBuilder()
            .setCustomId('author_url_input')
            .setLabel('Author URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the URL for the author')
            .setRequired(false)
            .setMaxLength(1024);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(authorNameInput),
            new ActionRowBuilder().addComponents(authorIconInput),
            new ActionRowBuilder().addComponents(authorUrlInput)
        );
    }
    else if (buttonId === 'description') {
        const descriptionInput = new TextInputBuilder()
            .setCustomId('description_input')
            .setLabel('Description')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Enter the description for your embed')
            .setRequired(true)
            .setMaxLength(4000);
        
        modal.addComponents(new ActionRowBuilder().addComponents(descriptionInput));
    }
    else if (buttonId === 'color') {
        const colorInput = new TextInputBuilder()
            .setCustomId('color_input')
            .setLabel('Color (HEX format)')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('#00a5ff')
            .setRequired(true)
            .setMaxLength(7);
        
        modal.addComponents(new ActionRowBuilder().addComponents(colorInput));
    }
    else if (buttonId === 'timestamp') {
        const timestampInput = new TextInputBuilder()
            .setCustomId('timestamp_input')
            .setLabel('Add Timestamp?')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Type "yes" to add current timestamp, or leave empty for none')
            .setRequired(false);
        
        modal.addComponents(new ActionRowBuilder().addComponents(timestampInput));
    }
    else if (buttonId === 'fields') {
        const fieldsInput = new TextInputBuilder()
            .setCustomId('fields_input')
            .setLabel('Fields (name|value|inline)')
            .setStyle(TextInputStyle.Paragraph)
            .setPlaceholder('Field Name|Field Value|true\nField Name 2|Field Value 2|false')
            .setRequired(false)
            .setMaxLength(1000);
        
        modal.addComponents(new ActionRowBuilder().addComponents(fieldsInput));
    }
    else if (buttonId === 'thumbnail') {
        const thumbnailInput = new TextInputBuilder()
            .setCustomId('thumbnail_input')
            .setLabel('Thumbnail URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the URL for the thumbnail image')
            .setRequired(false)
            .setMaxLength(1024);
        
        modal.addComponents(new ActionRowBuilder().addComponents(thumbnailInput));
    }
    else if (buttonId === 'image') {
        const imageInput = new TextInputBuilder()
            .setCustomId('image_input')
            .setLabel('Image URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the URL for the main image')
            .setRequired(false)
            .setMaxLength(1024);
        
        modal.addComponents(new ActionRowBuilder().addComponents(imageInput));
    }
    else if (buttonId === 'footer') {
        const footerTextInput = new TextInputBuilder()
            .setCustomId('footer_text_input')
            .setLabel('Footer Text')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the footer text')
            .setRequired(false)
            .setMaxLength(2048);
        
        const footerIconInput = new TextInputBuilder()
            .setCustomId('footer_icon_input')
            .setLabel('Footer Icon URL')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Enter the URL for the footer icon')
            .setRequired(false)
            .setMaxLength(1024);
        
        modal.addComponents(
            new ActionRowBuilder().addComponents(footerTextInput),
            new ActionRowBuilder().addComponents(footerIconInput)
        );
    }
    
    await interaction.showModal(modal);
}

async function handleEmbedModalSubmit(interaction) {
    const modalId = interaction.customId;
    const embedType = modalId.replace('embed_', '');
    
    try {
        const message = interaction.message;
        
        if (!message) {
            return await interaction.reply({ 
                content: `Error: Die ursprüngliche Nachricht konnte nicht gefunden werden. Bitte erstelle ein neues Embed.`, 
                ephemeral: true 
            });
        }
        
        let embed;
        try {
            embed = EmbedBuilder.from(message.embeds[0]);
        } catch (error) {
            console.error('Error getting original embed:', error);
            embed = new EmbedBuilder()
                .setColor("#00a5ff")
                .setTitle("New Embed")
                .setDescription("This is a new embed");
        }
        
        if (embedType === 'title') {
            const title = interaction.fields.getTextInputValue('title_input');
            embed.setTitle(title);
        }
        else if (embedType === 'author') {
            const authorName = interaction.fields.getTextInputValue('author_name_input');
            const authorIcon = interaction.fields.getTextInputValue('author_icon_input') || null;
            const authorUrl = interaction.fields.getTextInputValue('author_url_input') || null;
            
            embed.setAuthor({ 
                name: authorName, 
                iconURL: authorIcon, 
                url: authorUrl 
            });
        }
        else if (embedType === 'description') {
            const description = interaction.fields.getTextInputValue('description_input');
            embed.setDescription(description);
        }
        else if (embedType === 'color') {
            const color = interaction.fields.getTextInputValue('color_input');
            embed.setColor(color);
        }
        else if (embedType === 'timestamp') {
            const timestamp = interaction.fields.getTextInputValue('timestamp_input');
            if (timestamp && timestamp.toLowerCase() === 'yes') {
                embed.setTimestamp();
            } else {
                const embedData = embed.toJSON();
                delete embedData.timestamp;
                embed.setTimestamp(null);
            }
        }
        else if (embedType === 'fields') {
            const fieldsInput = interaction.fields.getTextInputValue('fields_input');
            
            const embedData = embed.toJSON();
            embedData.fields = [];
            
            if (fieldsInput && fieldsInput.trim() !== '') {
                const fieldLines = fieldsInput.split('\n');
                
                for (const line of fieldLines) {
                    const [name, value, inline] = line.split('|');
                    if (name && value) {
                        embed.addFields({ 
                            name: name.trim(), 
                            value: value.trim(), 
                            inline: inline ? inline.trim().toLowerCase() === 'true' : false 
                        });
                    }
                }
            }
        }
        else if (embedType === 'thumbnail') {
            const thumbnailUrl = interaction.fields.getTextInputValue('thumbnail_input');
            if (thumbnailUrl && thumbnailUrl.trim() !== '') {
                embed.setThumbnail(thumbnailUrl);
            } else {
                const embedData = embed.toJSON();
                delete embedData.thumbnail;
            }
        }
        else if (embedType === 'image') {
            const imageUrl = interaction.fields.getTextInputValue('image_input');
            if (imageUrl && imageUrl.trim() !== '') {
                embed.setImage(imageUrl);
            } else {
                const embedData = embed.toJSON();
                delete embedData.image;
            }
        }
        else if (embedType === 'footer') {
            const footerText = interaction.fields.getTextInputValue('footer_text_input');
            const footerIcon = interaction.fields.getTextInputValue('footer_icon_input') || null;
            
            if (footerText && footerText.trim() !== '') {
                embed.setFooter({ 
                    text: footerText, 
                    iconURL: footerIcon 
                });
            } else {
                const embedData = embed.toJSON();
                delete embedData.footer;
            }
        }
        
        try {
            await message.edit({ 
                content: `**Embed Creator** - Bearbeite dein Embed mit den Buttons unten:`,
                embeds: [embed], 
                components: message.components 
            });
            
            await interaction.reply({ 
                content: `Embed ${embedType} wurde erfolgreich aktualisiert!`, 
                ephemeral: true 
            });
        } catch (editError) {
            console.error('Error editing message:', editError);
            await interaction.reply({ 
                content: `Fehler beim Bearbeiten des Embeds. Bitte versuche es erneut.`, 
                ephemeral: true 
            });
        }
    } catch (error) {
        console.error('Error in handleEmbedModalSubmit:', error);
        
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: `Ein Fehler ist aufgetreten. Bitte versuche es erneut.`, 
                    ephemeral: true 
                });
            }
        } catch (replyError) {
            console.error('Error sending error reply:', replyError);
        }
    }
}

async function handleSendEmbed(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('send_embed_modal')
        .setTitle('Embed senden');
    
    const channelIdInput = new TextInputBuilder()
        .setCustomId('channel_id_input')
        .setLabel('Channel ID (optional)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Leer lassen, um im aktuellen Channel zu senden')
        .setRequired(false);
    
    const embedNameInput = new TextInputBuilder()
        .setCustomId('embed_name_input')
        .setLabel('Embed Name (zum Speichern)')
        .setStyle(TextInputStyle.Short)
        .setPlaceholder('Gib einen Namen ein, um das Embed zu speichern')
        .setRequired(true);
    
    modal.addComponents(
        new ActionRowBuilder().addComponents(channelIdInput),
        new ActionRowBuilder().addComponents(embedNameInput)
    );
    
    await interaction.showModal(modal);
}

async function handleSendEmbedModalSubmit(interaction) {
    try {
        const channelId = interaction.fields.getTextInputValue('channel_id_input');
        const embedName = interaction.fields.getTextInputValue('embed_name_input');
        
        const message = interaction.message;
        
        if (!message || !message.embeds || message.embeds.length === 0) {
            return await interaction.reply({ 
                content: `Error: Das ursprüngliche Embed konnte nicht gefunden werden. Bitte erstelle ein neues Embed.`, 
                ephemeral: true 
            });
        }
        
        const embed = EmbedBuilder.from(message.embeds[0]);
        
        let targetChannel;
        if (channelId && channelId.trim() !== '') {
            targetChannel = await interaction.client.channels.fetch(channelId).catch(() => null);
            if (!targetChannel) {
                return interaction.reply({ content: 'Ungültige Channel-ID!', ephemeral: true });
            }
        } else {
            targetChannel = interaction.channel;
        }
        
        await targetChannel.send({ embeds: [embed] });
        
        saveEmbed(embedName, embed.toJSON());
        
        try {
            await message.delete();
        } catch (deleteError) {
            console.error('Error deleting message:', deleteError);
        }
        
        await interaction.reply({ content: `Embed wurde an ${targetChannel} gesendet und als "${embedName}" gespeichert!`, ephemeral: true });
    } catch (error) {
        console.error('Error in handleSendEmbedModalSubmit:', error);
        
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: `Ein Fehler ist aufgetreten. Bitte versuche es erneut.`, 
                    ephemeral: true 
                });
            }
        } catch (replyError) {
            console.error('Error sending error reply:', replyError);
        }
    }
}

async function handleExportJson(interaction) {
    try {
        const message = interaction.message;
        
        if (!message || !message.embeds || message.embeds.length === 0) {
            return await interaction.reply({ 
                content: `Error: Das ursprüngliche Embed konnte nicht gefunden werden. Bitte erstelle ein neues Embed.`, 
                ephemeral: true 
            });
        }
        
        const embed = message.embeds[0];
        
        const embedJson = JSON.stringify(embed, null, 2);
        
        const tempFilePath = path.join(__dirname, 'temp_embed.json');
        fs.writeFileSync(tempFilePath, embedJson);
        
        await interaction.reply({ 
            content: 'Hier ist dein Embed als JSON:',
            files: [tempFilePath],
            ephemeral: true 
        });
        
        setTimeout(() => {
            try {
                if (fs.existsSync(tempFilePath)) {
                    fs.unlinkSync(tempFilePath);
                }
            } catch (unlinkError) {
                console.error('Error deleting temporary file:', unlinkError);
            }
        }, 5000);
    } catch (error) {
        console.error('Error in handleExportJson:', error);
        
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: `Ein Fehler ist aufgetreten beim Exportieren des Embeds. Bitte versuche es erneut.`, 
                    ephemeral: true 
                });
            }
        } catch (replyError) {
            console.error('Error sending error reply:', replyError);
        }
    }
}

async function handleImportJson(interaction) {
    const modal = new ModalBuilder()
        .setCustomId('import_json_modal')
        .setTitle('JSON importieren');
    
    const jsonInput = new TextInputBuilder()
        .setCustomId('json_input')
        .setLabel('Embed JSON')
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder('Füge hier dein Embed-JSON ein')
        .setRequired(true)
        .setMaxLength(4000);
    
    modal.addComponents(new ActionRowBuilder().addComponents(jsonInput));
    
    await interaction.showModal(modal);
}

async function handleImportJsonModalSubmit(interaction) {
    try {
        const jsonInput = interaction.fields.getTextInputValue('json_input');
        
        const message = interaction.message;
        
        if (!message) {
            return await interaction.reply({ 
                content: `Error: Die ursprüngliche Nachricht konnte nicht gefunden werden. Bitte erstelle ein neues Embed.`, 
                ephemeral: true 
            });
        }
        
        try {
            const embedData = JSON.parse(jsonInput);
            
            const embed = new EmbedBuilder(embedData);
            
            try {
                await message.edit({ 
                    content: `**Embed Creator** - Bearbeite dein Embed mit den Buttons unten:`,
                    embeds: [embed], 
                    components: message.components 
                });
                
                await interaction.reply({ 
                    content: `Embed wurde erfolgreich importiert!`, 
                    ephemeral: true 
                });
            } catch (editError) {
                console.error('Error editing message:', editError);
                await interaction.reply({ 
                    content: `Fehler beim Importieren des Embeds. Bitte versuche es erneut.`, 
                    ephemeral: true 
                });
            }
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            await interaction.reply({ content: 'Ungültiges JSON-Format! Bitte überprüfe deine Eingabe.', ephemeral: true });
        }
    } catch (error) {
        console.error('Error in handleImportJsonModalSubmit:', error);
        
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: `Ein Fehler ist aufgetreten. Bitte versuche es erneut.`, 
                    ephemeral: true 
                });
            }
        } catch (replyError) {
            console.error('Error sending error reply:', replyError);
        }
    }
}

async function handleCancelEmbed(interaction) {
    try {
        const message = interaction.message;
        
        if (!message) {
            return await interaction.reply({ 
                content: `Der Embed-Creator wurde abgebrochen.`, 
                ephemeral: true 
            });
        }
        
        try {
            await message.delete();
            await interaction.reply({ content: 'Embed-Erstellung abgebrochen!', ephemeral: true });
        } catch (deleteError) {
            console.error('Error deleting message:', deleteError);
            await interaction.reply({ content: 'Embed-Erstellung abgebrochen!', ephemeral: true });
        }
    } catch (error) {
        console.error('Error in handleCancelEmbed:', error);
        
        try {
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({ 
                    content: `Embed-Erstellung abgebrochen!`, 
                    ephemeral: true 
                });
            }
        } catch (replyError) {
            console.error('Error sending error reply:', replyError);
        }
    }
}

function saveEmbed(name, embed) {
    try {
        const embedsFilePath = path.join(__dirname, '../../Database/embeds.json');
        
        let embeds = {};
        if (fs.existsSync(embedsFilePath)) {
            try {
                const fileContent = fs.readFileSync(embedsFilePath, 'utf8');
                if (fileContent && fileContent.trim() !== '') {
                    embeds = JSON.parse(fileContent);
                }
            } catch (readError) {
                console.error('Error reading embeds.json:', readError);
            }
        }
        
        embeds[name] = embed;
        
        try {
            const dirPath = path.dirname(embedsFilePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
            }
            
            fs.writeFileSync(embedsFilePath, JSON.stringify(embeds, null, 2));
            return true;
        } catch (writeError) {
            console.error('Error writing to embeds.json:', writeError);
            return false;
        }
    } catch (error) {
        console.error('Error in saveEmbed:', error);
        return false;
    }
}