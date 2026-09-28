FROM node:22.14-slim

WORKDIR /app

COPY . .

RUN ["npm", "install"]
RUN ["npx", "prisma", "migrate", "dev"]
RUN ["npx", "prisma", "generate"]
EXPOSE 4004

CMD ["npm", "start"]