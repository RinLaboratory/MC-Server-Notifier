import fetch from 'node-fetch';

export const fetchDiscordWebHook = (Message, response, serverName) => {
    fetch(process.env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(Message)
    }).then(res => {
        console.log("Server ["+ serverName + "]: Running " + response.version.name);
    })
}