import { Server, Socket } from 'socket.io';
import { db } from './db.js';
import { QueryResult } from 'pg';
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
        console.log(Object.keys(connectionCount).length);
        console.log(connectionCount);

        socket.emit('enter', connectionCount)

        db.query("UPDATE users SET active = 'online' WHERE name = $1", [name])

        socket.on('disconnect', (): void => {
            delete connectionCount[name]
            db.query("UPDATE users SET active = 'offline' WHERE name = $1", [name])
        });

        socket.on('count', (): boolean => socket.emit('enter', connectionCount))

        socket.on('send mess', async (data): Promise<void> => {
            const row: QueryResult = await db.query("SELECT * FROM chat")
            const count: number = Number(row.rowCount)
            io.sockets.emit('add mess', {mess: data.mess, name: data.name, count: count + 1});
            
            await db.query(`INSERT INTO chat (name, text) VALUES ($1, $2)`, [data.name, data.mess]);
        });

        // anonimeChat
        socket.on('send', async (data): Promise<void> => {
            const {name, guest, text}: {name: string, guest: string, text: string} = data
            await db.query(`INSERT INTO anonimeChat (text, name, guest) VALUES ($1, $2, $3)`, [text, name, guest] )

            const query: string = 'SELECT * FROM anonimeChat WHERE name = $1 AND guest = $2 OR name = $3 AND guest = $4';

            const row: QueryResult = await db.query(query, [name, guest, guest, name])
            const count: number = Number(row.rowCount)
            io.sockets.emit('give', {text, name, count: count + 1})
        })
    })
}

export {socket}