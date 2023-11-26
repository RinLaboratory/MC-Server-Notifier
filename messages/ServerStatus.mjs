
export const OfflineServer = (serverName, serverURL) => {
    return ServerMessage(' ⚠️ Atención', 16724541, serverName, serverURL, false, " está fuera de línea.", false)
}

export const OnlineServer = (serverName, serverURL) => {
    return ServerMessage(' #️⃣ Atención', 15258703, serverName, serverURL, true, " está Operativo.", false)
}

export const UnknownError = (serverName, serverURL) => {
    return ServerMessage(' ❌ Error', 255, serverName, serverURL, false, " Tuvo un error inesperado al revisar su estado", true)
}

const ServerMessage = (title, color, serverName, serverURL, serverStatus, statusMessage, isError) => {

    const Mentions = []

    if (!serverStatus && isError)
    {
        Mentions.push("<@PrimaryDiscordID>")
    }
    else if (!serverStatus && !isError)
    {
        Mentions.push("<@PrimaryDiscordID>")
        Mentions.push("<@SecondaryDiscordID>")
    }

    return {
        username: process.env.DISCORD_WEBHOOK_NAME,
        avatar_url: process.env.DISCORD_WEBHOOK_PROFILEPICTURE,
        content: !serverStatus ? (Mentions.toString()) : (""),
        embeds: [
            {
                "title": title,
                "color": color,
                "thumbnail": {
                    "url": "",
                },
                "fields": [
                    {
                        "name": "El Servidor " + serverName + statusMessage,
                        "value": !serverStatus ? ("Revisar porfavor \n" + serverURL) : (""),
                        "inline": true
                    }
                ]
            }
        ]
    }
}