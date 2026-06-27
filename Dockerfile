# syntax=docker/dockerfile:1

FROM node:22.15.0-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY tsconfig.json tsup.config.ts ./
COPY src ./src
RUN pnpm build
RUN pnpm prune --prod

FROM node:22.15.0-slim AS runtime

RUN groupmod -n container node && usermod -l container -d /home/container -m node

WORKDIR /home/container

ENV NODE_ENV=production
ENV CONFIG_DIR=/home/container
ENV LANG_DIR=/home/container

COPY --from=build --chown=container:container /app/dist /app/dist
COPY --from=build --chown=container:container /app/node_modules /app/node_modules
COPY --chown=container:container package.json /app/package.json
COPY --chown=container:container lang.yaml /app/lang.yaml

RUN mkdir -p /home/container && chown -R container:container /home/container /app

VOLUME ["/home/container"]

USER container

CMD ["node", "/app/dist/index.mjs"]
