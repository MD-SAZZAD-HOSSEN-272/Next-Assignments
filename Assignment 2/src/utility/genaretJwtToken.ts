import type { JwtPayload } from "jsonwebtoken";
import jwt from 'jsonwebtoken'

const generateJwtToken = (payload : JwtPayload, singneture : string, expire : any) => {
    const token = jwt.sign(payload, singneture, {expiresIn : expire})
    return token
}

export default generateJwtToken