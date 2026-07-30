"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { authAction } from "../_action/authAction"
import { useActionState } from "react"


const LoginForm = () => {

     const [state, action, pending] = useActionState(authAction, false)

     console.log(state)

  return (
    <form action={action} className="space-y-4">
        <Card className="p-5 space-y-4">
            <Input name="email" type="email" placeholder="Enter Your Email" required />
            <Input name="password" type="password" placeholder="Enter Your Password" required />
            <Button type="submit">
                {pending ? "submiting......" : "submit"}
            </Button>
        </Card>
    </form>
  )
}

export default LoginForm