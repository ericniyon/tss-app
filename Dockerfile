FROM node:16.16-slim As development

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM node:16.16-slim as production

ENV NODE_ENV=
ENV PORT=
ENV POSTGRES_HOST=
ENV POSTGRES_PORT=
ENV POSTGRES_USER=
ENV POSTGRES_PASSWORD=
ENV POSTGRES_DB=
ENV JWT_EXPIRES_IN=
ENV JWT_PRIVATE_KEY=
ENV JWT_PUBLIC_KEY=
ENV ALLOWED_ORIGINS=
ENV SENDGRID_API_KEY=
ENV SENDGRID_EMAIL=
ENV SENT_EMAIL_FROM=
ENV PINDO_API_KEY=
ENV PINDO_API_URL=
ENV API_URL=
ENV CLIENT_APP_URL=
ENV ADMIN_APP_URL=
ENV DEFAULT_PASSWORD=
ENV CRON_EXPRESSION=
ENV SWAGGER_ENABLED=

WORKDIR /usr/src/app

COPY ./package.json ./yarn.lock ./

RUN yarn install --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn", "start:prod"]