import {Pool} from 'pg';
import config from '../config';

export const pool = new Pool({
    connectionString: config.connectString,
})

export const initDB = async() => {
    try {
        await pool.query(`
                CREATE TABLE IF NOT EXISTS users(
                 id SERIAL PRIMARY KEY,
                 name VARCHAR(20),
                 email VARCHAR(30) UNIQUE NOT NULL,
                 password TEXT NOT NULL,
                 role VARCHAR(20) DEFAULT 'contributor',
                 created_at TIMESTAMP DEFAULT NOW(),
                 updated_at TIMESTAMP DEFAULT NOW()
                )
            `)

       await pool.query(`
            CREATE TABLE IF NOT EXISTS issues (
                id SERIAL PRIMARY KEY,

                title VARCHAR(150) NOT NULL,

                description TEXT NOT NULL CHECK (length(description) >= 20),

                type TEXT CHECK (type IN ('bug', 'feature_request')) DEFAULT 'bug',

                status TEXT CHECK (
                status IN ('open', 'resolved', 'in_progress')
                ) DEFAULT 'open',

                reporter_id INTEGER NOT NULL,

                created_at TIMESTAMP DEFAULT NOW(),

                updated_at TIMESTAMP DEFAULT NOW()
            )
        `);
    } catch (error) {
        console.log(error, 'from db')
    }
}