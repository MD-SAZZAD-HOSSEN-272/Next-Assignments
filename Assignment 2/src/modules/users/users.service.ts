import { pool } from "../../db";
import type { IUsers } from "./users.interface";
import bcrypt from 'bcrypt'

const usersCreateIntoDB = async(payLoad : IUsers) => {
    const {name, email, password, role} = payLoad;
    const hashPassword = await bcrypt.hash(password, 10)

    const result = await pool.query(
        `
            INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *
        `, [name, email, hashPassword, role]
    );
    delete result.rows[0].password;

    return(result)
}


export const usersService = {
    usersCreateIntoDB,
}