FROM node:18

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]