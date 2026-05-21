import express, { type Request, type Response } from 'express'
import cors from "cors"
import { userRoute } from './modules/users/users.route';

const app = express();

app.use(cors())
app.use(express.json())


app.get('/', async (req : Request, res : Response) => {
    res.send('assignment 2 server')
})

app.use('/api/auth', userRoute)



export default app