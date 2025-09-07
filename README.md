# DiscordBot
⚡ Discord Bot – Fast, Modular, and Ready to Go  A lightweight, customizable Discord bot with multi-language support, secure architecture, and real-time features. Perfect for modern communities and devs who want full control.

## 🚀 Features

- Slash commands with auto-detection and pagination help menu  
- Automod with toggle system per server (anti-link, anti-spam, anti-mention, etc.) 
- Moderation tools: Warn, Kick, Ban, TempBan, Mute, Unmute  
- Logging system for actions like message delete/edit  
- Web dashboard integration *(coming soon)*  
- Discord OAuth for authentication *(in progress)*  

---

## 🛠 Setup

### Prerequisites

- Node.js v18 or higher  
- MongoDB URI (local or cloud)  
- Discord Bot Token  
- Firebase setup *(optional)*  

### Installation

```bash
git clone https://github.com/AliCloud0/DiscordBot
cd DiscordBot-main
npm install
npm install discord.js dotenv express

Environment Setup
Create a .env file in the root directory:

.env
TOKEN=your_discord_token
CLIENT_ID=your_bot_client_id
GUILD_ID=your_guild_id

Running the Bot
node deploy-commands.js
node index.js

To deploy slash commands globally or per guild:
node deploy.js

🧩 Commands
All commands are organized in the /commands folder and auto-loaded by category. Use /help to view all.

Admin

Info

Moderation

General

Owner

📌 TODO List
🔧 Core Features
slash commands by category

Help command with pagination and buttons

Logging system for moderation actions

Toggle-based automod (on/off per rule)

Rate-limited buttons on help command

🌐 Web Dashboard
Discord OAuth2 login

Guild selector

Toggle Automod settings from UI

View mod logs and history

🧪 Future Ideas

Dashboard theming (Dark mode)

Analytics dashboard (e.g. number of mutes/bans per day)


Bot support server

👤 Author
Khanmanan
GitHub: @AliCloud1
Bot Repo: Discord Bot

📜 License
  © 2025 AliCloud
