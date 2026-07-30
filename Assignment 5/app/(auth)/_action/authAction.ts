"use server"

import { cookies } from "next/headers";

type loginType = {
    success : boolean,
    statusCode : number,
    message : string,
    data : any
}

export const authAction = async(prevState : loginType, formData : FormData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    console.log(email, password)
    const response = await fetch("http://localhost:5000/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if(data.success){

        const cookiesStore = await cookies()

        cookiesStore.set("accessToken", data.data.accessToken, {
            httpOnly: true,
            maxAge : 60 * 60 * 24,
            sameSite : "lax",

        })

        cookiesStore.set("refreshToken", data.data.refreshToken, {
            httpOnly: true,
            maxAge : 60 * 60 * 24,
            sameSite : "lax",
        })

        

    }

    return data
}