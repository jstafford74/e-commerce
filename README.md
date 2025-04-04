This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployed on Vercel

https://e-commerce-green-alpha-57.vercel.app/

## Technologies & Libraries
- Prisma
- Neon
- Next Auth: next-auth.js.org
    - Authjs.dev
- bcrypt-ts-edge

## Changes to database
- npx prisma generate
- npx prisma migrate dev --name "named migration"
- npx prisma studio
- npx tsx ./db/seed


## Database set up
- Postgres via Neon serverless storage: https://neon.tech/

## Preview Email
https://dashboard.stripe.com

https://developer.paypal.com/home/

https://resend.com/api-keys

