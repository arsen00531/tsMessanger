import { CookieOptions, Request, Response } from "express";
import path from "path";
import { QueryResult } from "pg";
import { db } from "../db.js";
import { url } from "../hostURL.js";
import fs from "fs";

export class UserController {
    async main(req: Request, res: Response) {
        try {
            if (!req.cookies.name) {
                return res.render(path.join('pages', 'unlogged.ejs'), {error: undefined})
            }
            const messages: QueryResult = (await db.query('SELECT * FROM chat'))
            
            res.render(path.join('pages', 'logged.ejs'), {myName: req.cookies.name, row: messages.rows, count: messages.rowCount})
        } catch (error) {
            console.log(error)
            throw new Error('Oops Error')
        }
    }

    login(req: Request, res: Response) {
        res.render(path.join('pages', 'logall.ejs'), {error: undefined})
    }

    logAll(req: Request, res: Response) {
        res.render(path.join('pages', 'logall.ejs'), {error: undefined})
    }

    async users(req: Request, res: Response) {
        try {
            if (!req.cookies.name) {
                return res.render(path.join('pages', 'unlogged.ejs'), {error: undefined})
            }
            const users: QueryResult = await db.query('SELECT * FROM users WHERE name != $1', [req.cookies.name])
            
            const newUsers = users.rows.map(user => {
                if (!fs.existsSync(path.join('views', 'user_images', user.image))) {
                    user.image = 'camera.png'
                }
                return user
            })

            res.render(path.join('pages', 'users.ejs'), {row: newUsers, name: req.cookies.name})
        } catch (error) {
            console.log(error)
            throw new Error('Oops Error')
        }
    }

    async profile(req: Request, res: Response) {
        try {
            if (!req.cookies.name) {
                return res.render(path.join('pages', 'unlogged.ejs'), {error: undefined})
            }
            const user: QueryResult = await db.query('SELECT * FROM users WHERE name = $1', [req.query.login])

            if (user.rowCount === 0) return res.redirect(url)

            if (req.query.login === req.cookies.name) {
                res.render(path.join('pages', 'profile.ejs'), {name: req.query.login, row: user.rows[0]})
            }

            else {
                res.render(path.join('pages', 'profile_guest.ejs'), {name: req.cookies.name, row: user.rows[0]})
            }
        } catch (error) {
            console.log(error)
            throw new Error('Oops Error')
        }
    }

    async anonimeChat(req: Request, res: Response) {
        try {
            if (!req.cookies.name) {
                return res.render(path.join('pages', 'unlogged.ejs'), {error: undefined})
            }
            const name: CookieOptions = req.cookies.name
            const guest = req.query.id
            const query: string = 'SELECT * from anonimeChat WHERE name = $1 AND guest = $2 OR name = $3 AND guest = $4'
            const chat = await db.query(query, [name, guest, guest, name])
    
            res.render(path.join('pages', 'anonim.ejs'), {myName: req.cookies.name, row: chat.rows})
            
        } catch (error) {
            console.log(error)
            throw new Error("Oops Error")
        }
    }

    async imageChange(req: Request, res: Response) {
        try {
            if (req?.file === undefined) {
                return res.redirect(`${url}profile?login=${req.cookies.name}`)
            }

            await db.query('UPDATE users SET image = $1 WHERE name = $2', [req?.file?.filename, req.cookies.name])
            res.redirect(`${url}profile?login=${req.cookies.name}`)
            
        } catch (error) {
            console.log(error)
            throw new Error('Oops Error')
        }
    }
}