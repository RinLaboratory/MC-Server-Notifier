import { Worker } from 'worker_threads';
import dotenv from 'dotenv';

dotenv.config()

// Crear un nuevo hilo de trabajador para cada tarea
const worker1 = new Worker('./modules/Worker.mjs');
const worker2 = new Worker('./modules/Worker.mjs');
const worker3 = new Worker('./modules/Worker.mjs');
// const worker4 = new Worker('./modules/Worker.mjs');

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

// Enviar mensaje inicial a cada hilo de trabajador para iniciar las tareas
worker1.postMessage('1');
worker2.postMessage('2');
worker3.postMessage('3');
// worker4.postMessage('4');

// // Manejar errores del hilo de trabajador
// worker.on('error', error => {
//     console.error('Error en el hilo de trabajador:', error);
// });

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
