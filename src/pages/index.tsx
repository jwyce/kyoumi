import Image from "next/image"
import type { GetServerSidePropsContext } from "next/types"
import { api } from "@/utils/api"
import { parseCookies } from "oslo/cookie"

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context
  const deviceId = parseCookies(req.headers.cookie ?? "").get("device-id")

  if (!deviceId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    }
  }

  return { props: {} }
}

export default function Home() {
  const { data } = api.post.hello.useQuery({ text: "world" })
  return (
    <div className="flex min-h-[calc(100vh-58px)] flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <Image
          src="/logo.svg"
          alt="logo"
          width={150}
          height={150}
          className="rounded-md"
        />
        <h1 className="text-5xl font-bold">Kyoumi 興味</h1>
        <p>{data?.greeting}</p>
      </div>
    </div>
  )
}
