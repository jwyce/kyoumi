import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/router"
import type { GetServerSidePropsContext } from "next/types"
import { api } from "@/utils/api"
import { parseCookies } from "oslo/cookie"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const deviceId = parseCookies(req.headers.cookie ?? "").get("device-id")

  if (deviceId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  return { props: {} }
}

export default function Login() {
  const [password, setPassword] = useState("")
  const router = useRouter()
  const login = api.auth.login.useMutation()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-fuchsia-950 via-neutral-950 to-neutral-950">
      <div className="flex flex-col items-center justify-center gap-4">
        <Image
          src="/logo.svg"
          alt="logo"
          width={150}
          height={150}
          className="rounded-md"
        />
        <h1 className="text-5xl font-bold">Kyoumi 興味</h1>
        <div className="flex items-center gap-2">
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={async () => {
              const user = await login.mutateAsync({ password })
              if (user) {
                await router.push("/")
              }
            }}
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  )
}
