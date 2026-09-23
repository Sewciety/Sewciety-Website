# Sewciety

Website for Sewciety, the sewing club at the University of Waterloo. Built with TanStack Start, React and Tailwind.

## Development

```bash
npm install
npm run dev
```

The site runs at http://localhost:8080.

## Environment variables

| Name | Purpose |
| --- | --- |
| `MAILERLITE_API_TOKEN` | Adds newsletter signups to MailerLite. Put it in `.env.local` for local dev (git-ignored) and in your host's environment settings for production. |

## Deploying

`npm run build` uses Nitro, which detects the hosting provider (Vercel, Netlify, Cloudflare, ...) from the build environment and otherwise outputs a Node server in `.output/`.
