import { cookies } from "next/headers"

export const getMe = async () => {
    const cookiesStore = await cookies();
    const accessToken = cookiesStore.get("accessToken")?.value;
    if(!accessToken){
        return {
            success : false,
            message : "User Loged in"
        }
    }
    console.log(accessToken, 'from get me ')
    const res = await fetch(`${process.env.BACKEND_API_URL}/api/v1/users/profile`, {
        headers : {
            // Authorization : accessToken as unknown as string,
            // Authorization : `${accessToken}`,
            // Authorization : `Bearer ${accessToken}`

            Cookie : `accessToken=${accessToken}`
        },

        cache : "force-cache",
        next : {
            revalidate : 60 * 60 * 24, // 1day
            tags : ["my-profile"]
        }
    })

    const resutl = await res.json()

    return resutl
}