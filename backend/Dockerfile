FROM node:22-alpine

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY . .
RUN npx prisma generate
# If using Alpine
RUN apk add --no-cache ffmpeg

EXPOSE 8000

CMD ["sh", "-c", "npx prisma migrate deploy && npm run worker & npm start"]