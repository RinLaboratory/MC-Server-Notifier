# MC-Server-Notifier

Minecraft Server Availability Notifier

This node server uses Discord WebHook to work.

## Table of contents (TOC)

- [MC-Server-Notifier](#mc-server-notifier)
- [Table of contents (TOC)](#table-of-contents-toc)
- [Getting dependencies installed](#getting-dependencies-installed)
- [Setting up the server](#setting-up-the-server)
  - [`config.yaml`](#configyaml)
  - [Understanding `.env` file](#understanding-env-file)
- [Getting the development server running](#getting-the-development-server-running)
- [Getting the production server running](#getting-the-production-server-running)
- [Learn More](#learn-more)

## Getting dependencies installed

You will require the next dependencies to run this project:

- Node Js v22.15.x
- pnpm v10.11.0

### Installing pnpm

```bash
npm install --global pnpm@latest-10
```

### Installing all project dependencies

for installing the rest of dependencies located in the `package.json` file, you will use the following command:

```bash
pnpm i
```

## Setting up the server

You will need to modify the following files to fully set up this server

- [config.yaml](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/config.yaml)
- .env

# `config.yaml`

Follow the template and modify by your needs

```yaml
discordConfig:
  DISCORD_BOT_CLIENT_ID: "000000000000000000" # Your BOT user id
  DISCORD_BOT_GUILD_ID: "000000000000000000" # Your Server Id
  DISCORD_BOT_CHANNEL_ID: "000000000000000000" # The Channel you want this bot to send messages
  mentionUsers:
    - "000000000000000000" # The user id's that this bot will mention if something goes wrong
servers:
  - name: "Proxy" # Server name
    isMachine: true # whether this is a machine or a minecraft server
    config:
      - serverIP: "127.0.0.1" # Server ip
      - serverPort: 25565, # Server port
      - serverURL: "https://yourServerURLhere.com" # If you have a web server like pterodactyl, paste the url here and it will display it as part of the message for easy access
```

TIP: I **do not recommend** to monitor a **BungeeCord (waterfall, velocity, whatever...)** server because it has a **high false-positive rate**.

If you want to monitor that type of server, you are crazy and need to configure it well.

## Understanding `.env` file

See [.env.example](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/.env.example) for more info.

TIP: if you dont understand, you have to create the `.env` file, using the contents of the `.env.example` file.

This server works with Discord Bots, and you will need the following information to make it work:

```bash
DISCORD_BOT_TOKEN=''

NODE_ENV=development
```

## Getting the development server running

To run the development server, you will use the following command:

```bash
pnpm dev
```

## Getting the production server running

To compile the development server, you will use the following command:

```bash
pnpm build
```

Once finished compiling, you will use the following command to run the production server:

```bash
pnpm start
```

## Learn More

This project uses:

- [minecraft-server-util](https://www.npmjs.com/package/minecraft-server-util)
- [discord.js](https://www.npmjs.com/package/discord.js)
- [yaml](https://www.npmjs.com/package/yaml)
