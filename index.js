const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
    ],
    partials: [
        Partials.Channel, 
        Partials.Reaction, 
        Partials.Message
    ],
    allowedMentions: {
        parse: [`users`, `roles`],
        repliedUser: true,
    }
});

client.commands = new Collection();
const config = require('./config.js');

const { loadCommands } = require("./Handlers/commandHandler.js");
const { loadEvents } = require("./Handlers/eventHandler.js");

client.login(config.bot.token).then(() => {
    console.log(`Bot ist Online`);
    loadCommands(client);
    loadEvents(client);
}).catch(err => {
    console.error('Error logging in:', err);
});

module.exports = client;