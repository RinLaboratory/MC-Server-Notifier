import mcutil from 'minecraft-server-util';
import { fetchDiscordWebHook } from './FetchDiscordWebHook.mjs';
import { OfflineServer, OnlineServer, UnknownError } from '../messages/ServerStatus.mjs';
import { ThisContainer } from '../servers/Servers.mjs'

var lastOnlineStatus = false
var lastErrorStatus = false

export async function FetchServers(serverIP, serverPort, serverName, serverURL) {
    // Código para enviar el mensaje
    try {
        const response = await mcutil.status(serverIP, serverPort, { timeout: 15000 })
        if (!lastOnlineStatus) {
            fetchDiscordWebHook( OnlineServer(serverName, serverURL), response, serverName )
            lastErrorStatus = false
        }
        lastOnlineStatus = true
    } catch (error) {
        
        if(!lastErrorStatus)
        {
            if (error.message === 'Server is offline or unreachable' || `connect ECONNREFUSED ${serverIP}:${serverPort}`) {
                fetchDiscordWebHook( OfflineServer(serverName, serverURL), { version: { name: 'Unknown - Offline' }, serverName })
                lastOnlineStatus = false
                lastErrorStatus = true
            }
            else if (error.message === 'Socket closed unexpectedly while waiting for data') {
                console.warn("Server ["+ serverName + "]: " +error.message)
            } else {
                fetchDiscordWebHook( UnknownError(serverName, ThisContainer.serverURL), { version: { name: 'Unknown - Error' }, serverName })
                console.warn('Server ['+ serverName + ']: Ocurrió un error inesperado. traceback: ' + error)
                lastErrorStatus = true
            }
        }
    }
}