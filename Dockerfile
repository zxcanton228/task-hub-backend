# Build
FROM oven/bun:1.2.8 AS build

WORKDIR /app

COPY package.json bun.lock ./

RUN --mount=type=cache,target=/root/.bun bun install --frozen-lockfile

COPY . .

RUN bun prisma generate
RUN bun run prebuild
RUN bun run build

# Production
FROM oven/bun:1.2.8 AS production

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/emails ./emails
COPY --from=build /app/uploads ./uploads
COPY --from=build /app/.env.production /app/package.json /app/tsconfig-paths-bootstrap.js /app/tsconfig.json /app/bun.lock ./

RUN --mount=type=cache,target=/root/.bun bun install --frozen-lockfile --production

EXPOSE 4200
CMD ["bun", "run", "start:prod"]
# CMD ["cat" ,"dist/src/auth/auth.module.js"]
