FROM node:alpine as build

WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM node:alpine

WORKDIR /app
ENV NODE_ENV=production
COPY package.json package.json
RUN npm install --omit=dev
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
