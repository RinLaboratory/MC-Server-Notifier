import { parentPort } from 'worker_threads';
import { Auth, Lobby } from '../servers/Servers.mjs';
import { FetchServers } from './FetchServers.mjs';

  // Hilo de trabajador

  // Función para realizar la tarea de forma repetida
async function performTask(taskId) {
  const interval = 15000; // 15 segundos
  
  const task = async () => {
    if (taskId === 1) {
      await FetchServers(Auth.serverIP, Auth.serverPort, Auth.name, Auth.serverURL);
    }
    if (taskId === 2) {
      await FetchServers(Lobby.serverIP, Lobby.serverPort, Lobby.name, Lobby.serverURL);
    }
    // if (taskId === 5) {
    //   await FetchServers(Lobby.serverIP, Lobby.serverPort, Lobby.name, Lobby.serverURL);
    // }
  };

  // Ejecutar la tarea inicialmente
  await task();

  // Configurar el intervalo para ejecutar la tarea repetidamente
  setInterval(task, interval);
}

  // Escuchar mensajes enviados desde el hilo principal
  parentPort.on('message', message => {
    parentPort.postMessage('Hilo de trabajador iniciado');
      // Configurar el intervalo para ejecutar la función repetidamente
      if(message) {
        const taskId = parseInt(message);
        performTask(taskId);
      }
  });
