FROM node:14.8.0-alpine3.11 as build
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15.2-alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]