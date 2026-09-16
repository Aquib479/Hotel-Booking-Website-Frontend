# Frontend Deployment Guide

Vite + React SPA hosted on **AWS S3** behind **CloudFront** (HTTPS).

## Architecture

```
Browser
  │ https://www.resthalf.com
  ▼
CloudFront (E2Z7I6SCSFIFBP)
  │ origin: HTTP
  ▼
S3 static website (resthalfv2-prod-web)
  │ SPA fallback: index.html
  ▼
API calls → https://api.resthalf.com → API Gateway → EC2
```

## AWS Resources

| Resource | Identifier | Region |
|---|---|---|
| S3 bucket | `resthalfv2-prod-web` | ap-southeast-1 |
| CloudFront distribution | `E2Z7I6SCSFIFBP` (`d1ho83um3osm96.cloudfront.net`) | Global |
| ACM certificate (frontend) | `85d88262-0957-42d9-8848-e94b7933f93f` | us-east-1 |
| Custom domain | `www.resthalf.com` | — |

## Prerequisites

- Node.js >= 20
- pnpm (`npm i -g pnpm`)
- AWS CLI configured (`aws configure`) with access to the S3 bucket

## Environment Variables

Create `.env.production` in the project root. Vite bakes these into the build at compile time.

| Variable | Required | Description |
|---|---|---|
| `VITE_API_BASE_URL` | Yes | Backend API URL (`https://api.resthalf.com`) |
| `VITE_ZENTRUMHUB_API_KEY` | Yes | ZentrumHub API key (for hotel search) |
| `VITE_ZENTRUMHUB_ACCOUNT_ID` | Yes | ZentrumHub account ID |
| `VITE_ZENTRUMHUB_CHANNEL_ID` | Yes | ZentrumHub channel ID |
| `VITE_ZENTRUMHUB_NEXUS_URL` | Prod only | `https://nexus.prod.zentrumhub.com` (dev uses Vite proxy) |
| `VITE_ZENTRUMHUB_AUTOSUGGEST_URL` | Prod only | `https://autosuggest.travel.zentrumhub.com` |
| `VITE_ZENTRUMHUB_CURRENCY` | No | Default: `USD` |
| `VITE_ZENTRUMHUB_CULTURE` | No | Default: `en-US` |

> **Note:** `.env` is used for local dev, `.env.production` is used when running `pnpm build`.

---

## Deploy via AWS CLI

### 1. Install dependencies and build

```bash
pnpm install
pnpm build
```

This runs `tsc -b && vite build` and outputs static files to `dist/`.

### 2. Upload to S3

```bash
# Sync all files (hashed assets get long cache, old files are deleted)
aws s3 sync dist s3://resthalfv2-prod-web --delete \
  --cache-control "public,max-age=31536000,immutable"

# Re-upload index.html with no-cache (so browsers always get the latest)
aws s3 cp dist/index.html s3://resthalfv2-prod-web/index.html \
  --cache-control "no-cache,no-store,must-revalidate" \
  --content-type "text/html; charset=utf-8"
```

### 3. Invalidate CloudFront cache (optional, for instant updates)

```bash
aws cloudfront create-invalidation \
  --distribution-id E2Z7I6SCSFIFBP \
  --paths "/*"
```

Without invalidation, CloudFront serves cached content based on cache headers. Since `index.html` is set to no-cache, new deployments are picked up immediately for fresh visitors. Invalidation forces all edge locations to fetch the latest.

### Quick one-liner

```bash
pnpm build && \
aws s3 sync dist s3://resthalfv2-prod-web --delete --cache-control "public,max-age=31536000,immutable" && \
aws s3 cp dist/index.html s3://resthalfv2-prod-web/index.html --cache-control "no-cache,no-store,must-revalidate" --content-type "text/html; charset=utf-8"
```

---

## Deploy via AWS Console (UI)

### 1. Build locally

```bash
pnpm install
pnpm build
```

### 2. Upload to S3

1. Go to **AWS Console** → **S3** → **resthalfv2-prod-web**
2. Click **Upload**
3. Drag and drop all files/folders from the `dist/` directory
4. Click **Upload**

### 3. Set cache headers on index.html

1. In the bucket, click on **index.html**
2. Go to **Properties** tab → **Metadata** section → **Edit**
3. Set:
   - `Cache-Control` = `no-cache,no-store,must-revalidate`
   - `Content-Type` = `text/html; charset=utf-8`
4. **Save**

### 4. Invalidate CloudFront cache (optional)

1. Go to **AWS Console** → **CloudFront** → Distribution `E2Z7I6SCSFIFBP`
2. Go to **Invalidations** tab → **Create invalidation**
3. Enter path: `/*`
4. Click **Create invalidation**

---

## DNS Setup (GoDaddy)

The domain `resthalf.com` is managed in GoDaddy. Key DNS records:

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `d1ho83um3osm96.cloudfront.net` |
| Forwarding | `@` (root) | 301 redirect → `https://www.resthalf.com` |

ACM validation CNAMEs should remain in place for automatic certificate renewal.

---

## Local Development

```bash
pnpm install
pnpm dev
# Opens at http://localhost:5173
```

The Vite dev server proxies ZentrumHub API calls via `/zh-nexus` and `/zh-autosuggest` (configured in `vite.config.ts`) to avoid CORS issues.
