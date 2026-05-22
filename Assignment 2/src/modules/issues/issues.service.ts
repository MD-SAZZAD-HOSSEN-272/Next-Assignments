
import { pool } from "../../db";
import type { IIssues } from "./issues.interface";

const createIssueIntoDB = async(payload : IIssues) => {
    const {title, description, type, data} = payload;
    const result = await pool.query(`
            INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *
        `, [title, description, type, data.id])

        return result
}

const getAllUserFromDB = async (payload: any) => {

    console.log(payload)
  let sort = "DESC";

  if (payload.sort === "oldest") {
    sort = "ASC";
  }

  let query = `
    SELECT * FROM issues
  `;

  const conditions = [];

  if(payload.type){
    conditions.push(`type = '${payload.type}'`)
  }

  if(payload.status){
    conditions.push(`status = '${payload.status}'`)
  }

  if(conditions.length > 0){
    query = query + `WHERE ${conditions.join(" AND ")}`
  }





  const result = await pool.query(query);

  return result;
};

export const issuesService = {
    createIssueIntoDB,
    getAllUserFromDB,
}