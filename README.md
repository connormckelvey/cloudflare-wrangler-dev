# Cloudflare Wrangler Dev

Cloudflare Wranger Dev is a lightweight Javascript/Typescript API for Cloudflare's `wrangler` CLI tool, specifically scoped to the `wrangler dev` sub-command.

## Install

```bash
npm install cloudflare-wrangler-dev
```

## Usage

```typescript
import { WranglerDev } from 'cloudflare-wrangler-dev'

async function runTests() {
    const wrangler = new WranglerDev()
    await wrangler.start()
    // do stuff...
    await wrangler.stop()
}

runTests()
```