FROM oven/bun:alpine AS build

WORKDIR /usr/src/app

COPY . .

RUN bun install

FROM oven/bun:alpine

WORKDIR /usr/src/app

COPY --from=build /usr/src/app .

CMD ["bun", "start"]