# Kyoumi

興味 means - interest/curiousity/zest (for something). The idea is to create a way to share and organize topics for discussion completely anonymously.

## Tech Stack

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [Turso](https://turso.tech/)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Contributing

### Prerequisites

Ensure you have [node](https://nodejs.org/en) and [pnpm](https://pnpm.io/) installed before
proceeding. The following instructions assume you are on Linux, macOS, or WSL.

### Run Development Server

1. Clone the repository: `git clone https://github.com/jwyce/kyoumi`
2. Navigate to the project directory: `cd kyoumi`
3. Install dependencies: `pnpm i`
4. Copy the `.env.example` file to `.env` and fill in the required environment variables (follow the instructions under the deployment section for setting up SAAS providers and getting secrets)
5. Migrate the database (for the first time): `pnpm db:migrate`
6. Run the web app: `pnpm dev`
7. Click on the URL in the terminal output (defaults to `http://localhost:3000/`)

## How do I deploy this?

You can deploy this project to Vercel using the following steps:

1. Fork this repo and select the project in [Vercel](https://vercel.com/new).
2. Create a new database with the [Turso CLI](https://docs.turso.tech/quickstart) and copy the `TURSO_CONNECTION_URL` and `TURSO_AUTH_TOKEN` and add them to the environment variables in Vercel.
3. Deploy a meilisearch instance to [railway](https://railway.com/) following this [guide](https://www.meilisearch.com/docs/guides/deployment/railway#introduction) and copy the `MEILI_HOST` and `MEILI_MASTER_KEY` and add the environment variables in Vercel
4. Create a new app in [uploadthing](https://uploadthing.com/) and copy the `UPLOADTHING_TOKEN` and add to environment variables in Vercel
5. Create a new redis database in [upstash](https://upstash.com/) and add the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` to the environment variables in Vercel
6. Finally create and add a strong `PASSWORD` environment variable to Vercel (this will be how users will access the app for the first time)
7. Deploy the project and you are good to go!
