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

## Deployment

Pushes to `main` run CI and then deploy to AWS ECS Fargate
(`.github/workflows/deploy.yml`): the app is built into a standalone Next.js
Docker image with `NEXT_PUBLIC_*` values baked in from GitHub repository
variables, pushed to ECR, and rolled out behind the load balancer.
Health check: `GET /healthz`.

Infrastructure, one-time setup, rollbacks and logs are documented in the backend
repo: `ecommerce-backend/docs/DEPLOYMENT.md`.

Local production build:

```bash
NEXT_PUBLIC_API_URL=https://api.example.com NEXT_PUBLIC_SITE_URL=https://shop.example.com npm run build
docker build -t ecommerce-web --build-arg NEXT_PUBLIC_API_URL=… --build-arg NEXT_PUBLIC_SITE_URL=… .
```
