import { cookies } from "next/headers"

export const getNewAccessToken = async(refreshToken : string) => {
    // const cookieStore = await cookies();

    // const refreshToken = cookieStore.get("refreshToken")?.value;

    if(!refreshToken){
        return {
            success : false,
            message : "Refrsh token not found"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/auth/refresh-token`, {
        method : "POST",
        headers : {
            Cookie : `refreshToken=${refreshToken}`
        },
        cache : "no-cache"
    })

    const result = await res.json();


    return result



}