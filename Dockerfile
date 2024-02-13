FROM node:20-alpine

COPY package.json /app/

WORKDIR /app

RUN npm install

COPY next.config.mjs next.config.mjs postcss.config.js tailwind.config.ts tsconfig.json /app/
COPY public public/
COPY src src/

RUN mkdir /app/.next && chmod -R 777 /app/.next
RUN touch /app/next-env.d.ts && chmod -R 777 /app/next-env.d.ts

EXPOSE 3000

USER node

ENTRYPOINT [ "npm", "run" ]

CMD [ "dev" ]
