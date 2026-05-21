
import { pool } from "../../db";
import type { IIssues } from "./issues.interface";

const createIssueIntoDB = async(payload : IIssues) => {
    const {title, description, type, data} = payload;
    const result = await pool.query(`
            INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *
        `, [title, description, type, data.id])

        return result
}

export const issuesService = {
    createIssueIntoDB
}