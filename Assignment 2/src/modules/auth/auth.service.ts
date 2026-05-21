import config from "../../config";
import { pool } from "../../db";
import generateJwtToken from "../../utility/genaretJwtToken";
import type { Iauth } from "./auth.interface"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const authFromDb = async(payload : Iauth) => {
    const {email, password} = payload;
    const findUser = await pool.query(
        `
        SELECT * FROM users WHERE email=$1
        `, [email]
    )
    if(findUser.rows.length === 0){
        throw new Error('Invalid Credentials')
    }

    const user = findUser.rows[0]

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword){
        throw new Error('Invalid credentials')
    }

    delete user.password

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role : user.role,
    }

    if (!config.jwtSecret) {
  throw new Error("JWT Secret is missing");
}

    const accessToken = generateJwtToken(jwtPayload, config.jwtSecret, '1d')

    const userData = {
        token : accessToken,
        user : user
    }
    return userData


    
}

export const authService = {
    authFromDb
}