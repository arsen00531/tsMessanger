import { Request, Response } from "express";
import { QueryResult } from "pg";
import bcrypt from 'bcrypt'
import path from "path";
import { db } from "../db.js";
import { url } from "../hostURL.js";

export class AuthController {
    async logup (req: Request, res: Response) {
        try {
            const {userName, password}: {userName: string, password: string} = req.body

            const candidate: QueryResult = await db.query("SELECT id FROM users WHERE name = $1", [userName])

            if (candidate.rowCount === 1) {
                return res.render(path.join('pages', 'logall.ejs'), {error: "Аккаунт с таким именем уже существует"})
            }

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)

            await db.query('INSERT INTO users (name, password) VALUES ($1, $2)', [userName, hashPassword])

            res.redirect(url)
            
        } catch (error) {
            console.log(error)
            throw new Error("Oops error")
        }
    }

    async login (req: Request, res: Response) {
        try {
            const {userName, password}: {userName: string, password: string} = req.body
            const candidate: QueryResult = await db.query("SELECT * FROM users WHERE name = $1", [userName])

            if (candidate.rowCount === 0) {
                return res.render(path.join('pages', 'logall.ejs'), {error: "Аккаунт с таким именем не существует"})
            }

            if (!(await bcrypt.compare(password, candidate.rows[0].password))) {
                return res.render(path.join('pages', 'logall.ejs'), {error: "Неверный пароль"})
            }

            res.cookie('name', candidate.rows[0].name)
            res.redirect(url)

        } catch (error) {
            console.log(error)
            throw new Error("Oops error")
        }
    }

    async logout (req: Request, res: Response) {
        res.clearCookie('name')
        res.redirect(url)
    }
}