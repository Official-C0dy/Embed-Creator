# 🎨 Discord Embed Creator

<div align="center">
  [![Discord.js Version](https://img.shields.io/badge/discord.js-v14.13.0-blue.svg)](https://discord.js.org/)
  [![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
  [![Author](https://img.shields.io/badge/author-c0dy-orange.svg)](https://github.com/C0dy)
  
  *A powerful Discord bot for creating, editing, and managing embeds*
</div>

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Commands](#-commands)
- [Usage](#-usage)
- [Examples](#-examples)
- [File Structure](#-file-structure)
- [License](#-license)

## 🔍 Overview

The Discord Embed Creator is a powerful bot that allows you to create, edit, and manage attractive embed messages for your Discord server. With an intuitive user interface and extensive customization options, you can create professional-looking messages without writing a single line of code.

## ✨ Features

- **Easy Creation**: Create embeds with an interactive slash command
- **Extensive Customization**: Customize title, description, color, fields, author, footer, and more
- **Save & Reuse**: Store your embeds for later use
- **Editing**: Modify existing embeds at any time
- **Channel Selection**: Send embeds to any channel of your choice
- **User-Friendly**: Intuitive user interface with buttons and selection menus

## 🚀 Installation

1. **Prerequisites**:
   - [Node.js](https://nodejs.org/) (v16.9.0 or higher)
   - [npm](https://www.npmjs.com/) (comes with Node.js)

2. **Clone the repository**:
   ```bash
   git clone https://github.com/Official-C0dy/Embed-Creator.git
   cd Embed-Creator
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configuration**:
   - Edit the `config.js` file (see [Configuration](#-configuration))

5. **Start the bot**:
   ```bash
   npm start
   ```

## ⚙️ Configuration

1. Open the `config.js` file and add your bot token:
   ```javascript
   config.bot = {
       token: "YOUR_DISCORD_BOT_TOKEN", // Get your token from https://discord.com/developers/applications
   };
   ```

2. To obtain a bot token:
   - Visit the [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to the "Bot" tab and click "Add Bot"
   - Copy the token and paste it into `config.js`
   - Enable all intents under "Privileged Gateway Intents"

3. Invite your bot to your server:
   - Go to the "OAuth2" tab in the Developer Portal
   - Select the scopes "bot" and "applications.commands" under "URL Generator"
   - Choose the permissions "Send Messages", "Embed Links", and "Manage Messages"
   - Open the generated URL and add the bot to your server

## 🔧 Commands

The bot offers the following slash command with multiple subcommands:

- `/embed create` - Starts the interactive embed creator
- `/embed send [name] [channel]` - Sends a saved embed to a channel
- `/embed edit [name]` - Edits a saved embed
- `/embed delete [name]` - Deletes a saved embed

## 📝 Usage

1. **Create an embed**:
   - Use `/embed create`
   - Follow the interactive instructions to customize your embed
   - Save the embed with a unique name

2. **Send an embed**:
   - Use `/embed send [name] [channel]`
   - Select a saved embed from the autocomplete list
   - Optional: Choose a channel to send the embed to

3. **Edit an embed**:
   - Use `/embed edit [name]`
   - Select a saved embed from the autocomplete list
   - Edit the desired properties

4. **Delete an embed**:
   - Use `/embed delete [name]`
   - Select a saved embed from the autocomplete list

## 📋 Examples

### Example: Welcome Message

1. Create a new embed with `/embed create`
2. Set the title to "Welcome to our server!"
3. Add a description: "We're glad to have you here! Look around and have fun."
4. Choose a friendly color (e.g., green or blue)
5. Add a thumbnail with the server logo
6. Save the embed as "welcome"
7. Send it to your welcome channel with `/embed send welcome #welcome`

## 📁 File Structure

```
Embed-Creator/
├── Commands/           # Slash-Commands
│   └── embed.js        # Hauptbefehl für Embed-Verwaltung
├── Database/           # Datenspeicherung
│   └── embeds.json     # Speichert alle erstellten Embeds
├── Events/             # Event-Handler
│   └── interactionCreate.js  # Verarbeitet Interaktionen
├── config.js           # Bot-Konfiguration
├── index.js            # Hauptdatei des Bots
├── package.json        # Projektabhängigkeiten
└── README.md           # Projektdokumentation
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
