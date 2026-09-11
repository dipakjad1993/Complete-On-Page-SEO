FROM node:20-slim

# System Chromium so Puppeteer doesn't download ~300MB at runtime.
RUN apt-get update && apt-get install -y --no-install-recommends chromium ca-certificates fonts-liberation \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_DOWNLOAD=true \
    CHROME_PATH=/usr/bin/chromium \
    NODE_ENV=production

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node","server.js"]
