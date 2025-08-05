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
- [Setting up server in pterodactyl](#setting-up-server-in-pterodactyl)
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
  DISCORD_BOT_TOKEN: "" # Your BOT auth token
  mentionUsers:
    - "000000000000000000" # The user id's that this bot will mention if something goes wrong
servers:
  - name: "Proxy" # Server name
    config:
      - serverIP: "127.0.0.1" # Server ip
      - serverPort: 25565, # Server port
      - serverURL: "https://yourServerURLhere.com" # If you have a web server like pterodactyl, paste the url here and it will display it as part of the message for easy access
  - name: "localhost"
    isMachine: true # whether this is a machine or a minecraft server, if this is a machine, it will display its CPU, RAM and DISK USAGE
    config:
      serverIP: "127.0.0.1" # Server ip, since this is localhost, 127.x.x.x, 172.x.x.x, 0.x.x.x will be detected as localhost
      serverPort: 1 # since this is localhost, this value really doesnt matter but it has to be a valid port number
      serverURL: "https://yourServerURLhere.com"
  - name: "other-server-node"
    isMachine: true # whether this is a machine or a minecraft server, if this is a machine, it will display its CPU, RAM and DISK USAGE
    config:
      serverIP: "192.168.0.1" # Server ip, since this is other machine, it will fetch data there.
      serverPort: 8000
      serverURL: "https://yourServerURLhere.com"
```

TIP: I **do not recommend** to monitor a **BungeeCord (waterfall, velocity, whatever...)** server because it has a **high false-positive rate**.

If you want to monitor that type of server, you are crazy and need to configure it well.

## Understanding `.env` file

See [.env.example](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/.env.example) for more info.

TIP: if you dont understand, you have to create the `.env` file, using the contents of the `.env.example` file.

This server works with Discord Bots, and you will need the following information to make it work:

```bash
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

## Setting up server in pterodactyl

Its very tricky to get a node server running in pterodactyl, specially if typescript is involved.

I used this egg to get it running: [NodeJS-Universal](https://github.com/YajTPG/pterodactyl-eggs/blob/universal/egg-node-j-s--universal.json) from YajTPG (i know it's outdated)

Inside the docker images located in the egg's config i added this one to get Node v22 `ghcr.io/zastinian/esdock:nodejs_22`, BEWARE: you will have to modify the start configuration message for the panel to detect that the app is running:

- Start Configuration
- ```json
  {
    "done": "app is successfully online",
    "userInteraction": []
  }
  ```

You will have to manually compile the app in your computer since installing dependencies with pterodactyl will throw EOENT errors when trying to resolve packages like `typescript`, `eslint` and `pnpm`.

When you have compiled the project, you have to compress the project folder into `zip`, `rar`, `tar.gz`, whichever format suits you better. Make sure to include these folders and files (!important):

- `.cache`
- `dist`
  - `index.mjs`
- `node_modules`: everything inside
- `package.json`
- `config.yaml`

Once that is done, your startup command is the following `node dist/index.mjs`.

If you want to update `config.yml`, you DONT have to recompile the entire project again to apply changes, just restart the app and that's it!

## Learn More

This project uses:

- [minecraft-server-util](https://www.npmjs.com/package/minecraft-server-util)
- [discord.js](https://www.npmjs.com/package/discord.js)
- [yaml](https://www.npmjs.com/package/yaml)
