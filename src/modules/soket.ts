import { Server } from 'socket.io';
import { db } from './db.js';
import { QueryResult } from 'pg';

const socket = (io: Server) => {
    io.sockets.on('connection', function (socket) {

        socket.on('send mess', async function (data) {
            const row: QueryResult = await db.query("SELECT * FROM chat")
            const count = Number(row.rowCount)
            io.sockets.emit('add mess', {mess: data.mess, name: data.name, count: count + 1});
            
            await db.query(`INSERT INTO chat (name, text) VALUES ($1, $2)`, [data.name, data.mess]);
        });

        // anonimeChat
        socket.on('send', async function(data) {
            const {name, guest, text} = data
            await db.query(`INSERT INTO anonimeChat (text, name, guest) VALUES ($1, $2, $3)`, [text, name, guest] )

            const query: string = 'SELECT * FROM anonimeChat WHERE name = $1 AND guest = $2 OR name = $3 AND guest = $4';

            const row: QueryResult = await db.query(query, [name, guest, guest, name])
            const count = Number(row.rowCount)
            io.sockets.emit('give', {text, name, count: count + 1})
        })
    })
}

export {socket}