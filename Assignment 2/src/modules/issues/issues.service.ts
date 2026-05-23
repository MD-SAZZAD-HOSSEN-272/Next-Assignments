
import type { JwtPayload } from "jsonwebtoken";
import { pool } from "../../db";
import sendResponse from "../../utility/sendResponse";
import type { IUsers } from "../users/users.interface";
import type { IIssues, IQuery } from "./issues.interface";

const createIssueIntoDB = async(payload : IIssues) => {
    const {title, description, type, data} = payload;
    const result = await pool.query(`
            INSERT INTO issues(title, description, type, reporter_id) VALUES($1, $2, $3, $4) RETURNING *
        `, [title, description, type, data.id])

        return result
}

const getAllIssuesFromDB = async (payload: IQuery) => {

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

        query =  query + ` ORDER BY created_at ${sort}`

        const searchData = await pool.query(query);
        const datas = searchData.rows

        const findDataReporter = await Promise.all(
            datas.map(async(data) => {
            const reporter = await pool.query(`
                SELECT * FROM users WHERE id=$1 
                `, [data.reporter_id])

                delete data.reporter_id

                const reporterData = reporter.rows[0]

               return {
                ...data,
                reporter: {
                    id: reporterData.id,
                    name : reporterData.name,
                    role : reporterData.role
                }
               }
        })
        )
        
        return findDataReporter
};


const getSingleIssue = async(paylad : string) => {
    const id = paylad;


    const result = await pool.query(`
            SELECT * FROM issues WHERE id=$1
        `, [id])

        const reporterId = result.rows[0].reporter_id;

        const reporter = await pool.query(`
                SELECT * FROM users WHERE id=$1
            `, [reporterId])

        delete result.rows[0].reporter_id

        

        return {
            ...result.rows[0],
            reporter: {
                id : reporter.rows[0].id,
                name : reporter.rows[0].name,
                role : reporter.rows[0].role,

            }
        }
}


const updateIssue = async(payload : JwtPayload, id : string, updateData : IIssues) => {
   
    const decodedUser = payload;
    const issueId = id;
    const data = updateData;

    const findUser = await pool.query(`
            SELECT * FROM users WHERE email = $1
        `, [decodedUser.email])


    const user = findUser.rows[0]

    if(!user){
        throw new Error('user not found')
    }

    const findIssue = await pool.query(`
            SELECT * FROM issues WHERE id=$1
        `, [issueId])


        const issue = findIssue.rows[0]

        if (!issue) {
    throw new Error("Issue not found");
  }

        if((user.id === issue.reporter_id && issue.status === 'open') || user.role === 'maintainer'){
            const result = await pool.query(`
                    UPDATE issues
                    SET
                    title=COALESCE($1, title),
                    description=COALESCE($2, description),
                    type=COALESCE($3, type),
                    updated_at = NOW()

                    WHERE id=$4 RETURNING *
                `, [data.title, data.description, data.type, issueId ])


                return result
        }else{
            throw new Error('Unauthorized user')
        }




}


const deleteIssueFromDB = async(id : string) => {
    
    const result = await pool.query(`
             DELETE FROM issues
             WHERE id = $1
        `, [id])

    return result
}

export const issuesService = {
    createIssueIntoDB,
    getAllIssuesFromDB,
    getSingleIssue,
    updateIssue,
    deleteIssueFromDB
}