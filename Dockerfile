# Next.js standalone image for ECS.
#
# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so
# they are build args, not runtime env. One image per environment.

ARG NODE_VERSION=22

# ---- deps ------------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# --ignore-scripts skips the husky `prepare` hook (no .git in the image).
RUN --mount=type=cache,target=/root/.npm npm ci --ignore-scripts --no-audit --no-fund

# ---- build -----------------------------------------------------------------
FROM deps AS build
COPY . .

ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_RAZORPAY_KEY_ID=""
ARG NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID=""
ARG GOOGLE_SITE_VERIFICATION=""

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    NEXT_OUTPUT_STANDALONE=true \
    NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_RAZORPAY_KEY_ID=${NEXT_PUBLIC_RAZORPAY_KEY_ID} \
    NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID=${NEXT_PUBLIC_RAZORPAY_CHECKOUT_CONFIG_ID} \
    GOOGLE_SITE_VERIFICATION=${GOOGLE_SITE_VERIFICATION}

# `npm run build` runs scripts/check-production-env.mjs first, so a missing
# NEXT_PUBLIC_API_URL / NEXT_PUBLIC_SITE_URL fails the image build.
RUN npm run build

# ---- runtime ---------------------------------------------------------------
FROM node:${NODE_VERSION}-bookworm-slim AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
WORKDIR /app

RUN apt-get update \
 && apt-get install -y --no-install-recommends tini \
 && rm -rf /var/lib/apt/lists/*

COPY --chown=node:node --from=build /app/.next/standalone ./
COPY --chown=node:node --from=build /app/.next/static ./.next/static
COPY --chown=node:node --from=build /app/public ./public

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/healthz').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/usr/bin/tini", "--"]
CMD ["node", "server.js"]
