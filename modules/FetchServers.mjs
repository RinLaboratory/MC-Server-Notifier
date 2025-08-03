import mcutil from 'minecraft-server-util';
import { fetchDiscordWebHook } from './FetchDiscordWebHook.mjs';
import { OfflineServer, OnlineServer, UnknownError } from '../messages/ServerStatus.mjs';
import { ThisContainer } from '../servers/Servers.mjs'

var lastOnlineStatus = false
var lastErrorStatus = false

export async function FetchServers(Server) {
    // Código para enviar el mensaje
    try {
        const response = await mcutil.status(Server.serverIP, Server.serverPort, { timeout: 15000 })
        if (!lastOnlineStatus) {
            fetchDiscordWebHook( OnlineServer(Server.name, Server.serverURL), response, Server.name )
            lastErrorStatus = false
        }
        lastOnlineStatus = true
    } catch (error) {
        
        if(!lastErrorStatus)
        {
            if (error.message === 'Server is offline or unreachable' || `connect ECONNREFUSED ${Server.serverIP}:${Server.serverPort}`) {
                fetchDiscordWebHook( OfflineServer(Server.name, Server.serverURL), { version: { name: 'Unknown - Offline' }, serverName: Server.name })
                lastOnlineStatus = false
                lastErrorStatus = true
            }
            else if (error.message === 'Socket closed unexpectedly while waiting for data') {
                console.warn("Server ["+ Server.name + "]: " +error.message)
            } else {
                fetchDiscordWebHook( UnknownError(Server.name, ThisContainer.serverURL), { version: { name: 'Unknown - Error' }, serverName: Server.name })
                console.warn('Server ['+ Server.name + ']: Ocurrió un error inesperado. traceback: ' + error)
                lastErrorStatus = true
            }
        }
    }
}