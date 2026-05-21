import express, { type Request, type Response } from 'express'
import cors from "cors"
import { userRoute } from './modules/users/users.route';
import { authRouter } from './modules/auth/auth.route';
import { issuesRoute } from './modules/issues/issues.route';

const app = express();

app.use(cors())
app.use(express.json())


app.get('/', async (req : Request, res : Response) => {
    res.send('assignment 2 server')
})

app.use('/api/auth', userRoute)
app.use('/api/auth', authRouter)
app.use('/api/issues', issuesRoute)



export default app