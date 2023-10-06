# TODO Start: [Student] Complete Dockerfile
FROM node:18 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn config set registry https://registry.npmmirror.com

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build 

FROM node:18 

WORKDIR /app

COPY --from=build /app/public ./public

COPY --from=build /app/.next/standalone ./

COPY --from=build /app/.next/static ./.next/static

ENV PORT 80

ENV HOSTNAME 0.0.0.0

EXPOSE 80

CMD ["node", "server.js"]
# TODO End