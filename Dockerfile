FROM node:24-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 8000

CMD ["sh", "-c", "npx prisma generate && npx prisma db push --accept-data-loss && npm run dev"]