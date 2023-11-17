FROM node:18-alpine

ENV DATABASE_URL='mysql://rmyft40q5u8ux0e2wag0:pscale_pw_eFYadzjwTzfKv9X9Ktu35RGZJkeiKqqPNsQohfIVU6E@aws.connect.psdb.cloud/whatdb?sslaccept=strict'
ENV SECRET='2023-b4TaS_t4na1-1'

WORKDIR /app

COPY package.json ./
RUN npm i

COPY . .
CMD [ "nest", "start", "--watch" ]