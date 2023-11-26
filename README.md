# MC-Server-Notifier
Minecraft Server Availability Notifier

## Getting dependencies installed

You will require the next dependencies to run this project:

- Node Js v18.15.x
- Yarn

for installing the rest of dependencies located in the `package.json` file, you will use the following command:

```bash
yarn
```

## Setting up the server

You will need to modify the following files to fully set up this server

- [ServerStatus.mjs](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/messages/ServerStatus.mjs)
- [Servers.mjs](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/servers/Servers.mjs)
- [server.mjs](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/server.mjs)
- [Worker.mjs](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/modules/Worker.mjs)
- .env

# `ServerStatus.mjs`
There are two instances that you will need to edit

Line 20
```bash
Mentions.push("<@PrimaryDiscordID>")
```
"PrimaryDiscordID" is a Discord user ID and it may belong to someone who has access to this server.

Line 24 & 25
```bash
Mentions.push("<@PrimaryDiscordID>")
Mentions.push("<@SecondaryDiscordID>")
```
"PrimaryDiscordID" is a Discord user ID and it may belong to someone who has access to this server.
"SecondaryDiscordID" is a Discord user ID and it may belong to someone who has access to the server thats being monitored.
You can actually add as many as Discord user ID as you want by Ctrl+C / Ctrl+V `Mentions.push("<@SomeDiscordUserID>")` below line 25. 
I recommend to be at least two people and at most 4 people. You dont want to mass ping someone for no reason.

# `Servers.mjs`
This file has JSON format constants and it contains all the servers you want to monitor.

Example:
```bash
export const Server = {
    name: 'Server Name',
    serverIP: '127.0.0.1',
    serverPort: 25565,
    serverURL: 'https://yourServerURLhere.com',
}
```
- name: is the name of the server you want to monitor
- serverIP: is the internal server IP you want to monitor. You want to use `localhost` or `127.0.0.1` if is in your local machine. if this is located somewhere else, you have to put that machine IP and make sure your firewall is well set-up.
- serverPort: is the Port of the server you want to monitor.
- serverURL: If you are using a panel web server Like [Pterodactyl](https://pterodactyl.io/) you want to paste the server url you want to monitor here. it looks something like `https://yourServerURLhere.com/server/a000b000`.

TIP: I **do not recommend** to monitor a **BungeeCord (waterfall, velocity, whatever...)** server because it has a **high false-positive rate**. if you want to monitor that type of server, you are crazy and need to configure it well.

Once this file has all the servers you want to monitor, we can take the next step.

# `server.mjs`
This is the main file where all servers constantly fetch using workers.

you may add as many workers as you want, but i would not exceed 8 servers.
Keep note that every snippet of code here has at least a commented example (`worker4`) for you to understand.

Line 6 to 10
```bash
// Crear un nuevo hilo de trabajador para cada tarea
const worker1 = new Worker('./modules/Worker.mjs');
const worker2 = new Worker('./modules/Worker.mjs');
const worker3 = new Worker('./modules/Worker.mjs');
// const worker4 = new Worker('./modules/Worker.mjs');
```
Each worker is for **each server you want to fetch**. you want to keep the numbering.
If you have 7 servers, you have to have 7 workers.

Line 12 to 25
```bash
console.log('Hilo principal, esto se ejecuta 1 vez');
// Escuchar mensajes enviados desde los hilos de trabajador
worker1.on('message', message => {
  console.log('Worker 1:', message);
});
worker2.on('message', message => {
  console.log('Worker 2:', message);
});
worker3.on('message', message => {
  console.log('Worker 3:', message);
});
// worker4.on('message', message => {
//   console.log('Worker 4:', message);
// });
```
Each worker has to be instantiated. you want to keep the numbering.

Line 27 to 31
```bash
// Enviar mensaje inicial a cada hilo de trabajador para iniciar las tareas
worker1.postMessage('1');
worker2.postMessage('2');
worker3.postMessage('3');
// worker4.postMessage('4');
```
Each worker has to be initiated in order to work. you want to keep the numbering.

Line 38 to 56
```bash
// Manejar la finalización del hilo de trabajador
worker1.on('exit', code => {
console.log(`Hilo de trabajador finalizado con código de salida ${code}`);
});

// Manejar la finalización del hilo de trabajador
worker2.on('exit', code => {
console.log(`Hilo de trabajador finalizado con código de salida ${code}`);
});

// Manejar la finalización del hilo de trabajador
worker3.on('exit', code => {
console.log(`Hilo de trabajador finalizado con código de salida ${code}`);
});

// // Manejar la finalización del hilo de trabajador
// worker4.on('exit', code => {
// console.log(`Hilo de trabajador finalizado con código de salida ${code}`);
// });
```
Each worker has to have a ending logic, even if its never reached. you want to keep the numbering.

Once that is ready we can take the next step.

# `Worker.mjs`
This file is the logic where the servers fetch. you will modify this file as your needs.

First you want to import your servers here.

Line 2
```bash
import { Auth, Lobby } from '../servers/Servers.mjs';
```
In this case, `Auth` & `Lobby` are the constants that have the servers information you have to import all the servers you want to monitor here. See [`Servers.mjs`](#-serversmjs-) for more info.

Line 9
```bash
const interval = 15000; // 15 seconds
```
You can change this interval to fetch to be longer or shorter but i would leave as it is.

Line 12 to 20
```bash
    if (taskId === 1) {
      await FetchServers(Auth);
    }
    if (taskId === 2) {
      await FetchServers(Lobby);
    }
    // if (taskId === 3) {
    //   await FetchServers(Lobby);
    // }
```
Here is where the workers that we created before are going to fetch the servers. See [`server.mjs`](#-servermjs-) for more info.
- taskId: is the worker number that you assigned in the file `server.mjs`, you want to keep the numbering.
- FetchServers(): is the function that will fetch your server. every taskid has to have a different and unique server.

## Understanding `.env` file
See [.env.example](https://github.com/RinLaboratory/MC-Server-Notifier/blob/main/.env.example) for more info.
TIP: if you dont understand, you have to create the `.env` file, using the contents of the `.env.example` file.

This server works with Discord Webhooks, and you will need the following information to make it work:
```bash
DISCORD_WEBHOOK_URL=''
DISCORD_WEBHOOK_NAME=''
DISCORD_WEBHOOK_PROFILEPICTURE=''
```
if that information was not self explanatory, please read the following:

# How to set up a Discord WebHook

- ![How to discord webhook part 1](https://cdn.discordapp.com/attachments/826094336169082920/1178157653394984990/Captura_de_pantalla_2023-11-25_231635.png?ex=65751fd1&is=6562aad1&hm=547330b2963d98def906e9a77d47a00ab583aa438417eb79420e5f6d6959c2fa&)
- ![How to discord webhook part 2](https://cdn.discordapp.com/attachments/826094336169082920/1178157653017493565/Captura_de_pantalla_2023-11-25_231720.png?ex=65751fd1&is=6562aad1&hm=cb304952bbe48b936d8b13bd76e8f5c9744aa256717a3f2944bb456f812b581b&)

once you have copied your webhook URL, you paste it in the `.env` file in the section `DISCORD_WEBHOOK_URL`, It will look like this.
```bash
DISCORD_WEBHOOK_URL='https://discord.com/api/webhooks/someChannelID/someToken'
DISCORD_WEBHOOK_NAME=''
DISCORD_WEBHOOK_PROFILEPICTURE=''
```

Give your webHook a name in the section `DISCORD_WEBHOOK_NAME` and a profile picture `DISCORD_WEBHOOK_PROFILEPICTURE`, It will look like this.
```bash
DISCORD_WEBHOOK_URL='https://discord.com/api/webhooks/someChannelID/someToken'
DISCORD_WEBHOOK_NAME='Your amazing name'
DISCORD_WEBHOOK_PROFILEPICTURE='https://urlOfYourAmazingPfp.com'
```

## Getting the development server running

To run the development server, you will use the following command:

```bash
yarn dev
```

## Getting the production server running

Use the following command to run the production server:

```bash
yarn start
```

## Learn More

This project uses:

- [dotenv](https://www.npmjs.com/package/dotenv)
- [minecraft-server-util](https://www.npmjs.com/package/minecraft-server-util)
- [node-fetch](https://www.npmjs.com/package/node-fetch)
- [nodemon](https://www.npmjs.com/package//nodemon)