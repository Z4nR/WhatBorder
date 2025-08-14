FROM node:22

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Use dummy DATABASE_URL just for generate
ENV DATABASE_URL="file:./dev.db"

RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start:prod"]