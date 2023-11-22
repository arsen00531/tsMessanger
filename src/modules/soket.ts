import { Server, Socket } from 'socket.io';
import { db } from './db.js';
import { Object } from '../types/object.js';

const socket = (io: Server): void => {
    let connectionCount: Object = {}

    io.sockets.on('connection', (socket: Socket): void => {
        let name: string = ''

        socket.handshake.headers.cookie?.trim().split(';').forEach(cookie => {
            const cookieSplit: string[] = cookie.split('=')
            if (cookieSplit[0].trim() === 'name') name = cookieSplit[1]
        })

        connectionCount[name] = 'online'

        socket.emit('enter', connectionCount)

        socket.on('disconnect', (): void => {
            delete connectionCount[name]
        });

        socket.on('count', (): boolean => socket.emit('enter', connectionCount))

        socket.on('send mess', async (data): Promise<void> => {
            const {name, text}: {name: string, text: string} = data
            io.sockets.emit('add mess', {text, name});
            
            await db.query(`INSERT INTO chat (name, text) VALUES ($1, $2)`, [name, text]);
        });

        // anonimeChat
        socket.on('send', async (data): Promise<void> => {
            const {name, guest, text}: {name: string, guest: string, text: string} = data

            await db.query(`INSERT INTO anonimeChat (text, name, guest) VALUES ($1, $2, $3)`, [text, name, guest] )

            io.sockets.emit('give', {text, name})
        })
    })
}

export {socket}