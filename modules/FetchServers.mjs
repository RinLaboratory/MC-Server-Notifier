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
            fetchDiscordWebHook( OnlineServer(Server.serverName, Server.serverURL), response, Server.serverName )
            lastErrorStatus = false
        }
        lastOnlineStatus = true
    } catch (error) {
        
        if(!lastErrorStatus)
        {
            if (error.message === 'Server is offline or unreachable' || `connect ECONNREFUSED ${Server.serverIP}:${Server.serverPort}`) {
                fetchDiscordWebHook( OfflineServer(Server.serverName, Server.serverURL), { version: { name: 'Unknown - Offline' }, serverName: Server.serverName })
                lastOnlineStatus = false
                lastErrorStatus = true
            }
            else if (error.message === 'Socket closed unexpectedly while waiting for data') {
                console.warn("Server ["+ Server.serverName + "]: " +error.message)
            } else {
                fetchDiscordWebHook( UnknownError(Server.serverName, ThisContainer.serverURL), { version: { name: 'Unknown - Error' }, serverName: Server.serverName })
                console.warn('Server ['+ Server.serverName + ']: Ocurrió un error inesperado. traceback: ' + error)
                lastErrorStatus = true
            }
        }
    }
}