function loadCommands(client) {
    const config = require('../config.js');
    const fs = require('fs');
  
    let developerArray = [];
    let commandsArray = [];
  
    const commandFiles = fs.readdirSync(`./Commands`).filter(f => f.endsWith(".js"));
        
    for (const file of commandFiles) {
        const commandFile = require(`../Commands/${file}`);

        const properties = {...commandFile};
        client.commands.set(commandFile.data.name, properties);

        commandsArray.push(commandFile.data.toJSON());
    }
  
    client.application.commands.set(commandsArray);
    const developerGuild = client.guilds.cache.get(config.bot.guildId);
    developerGuild.commands.set(developerArray);
  }
  
  module.exports = {loadCommands};