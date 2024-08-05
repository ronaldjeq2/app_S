# Stage 1 - the build process
FROM node:8-wheezy as builder

# Setting de url variable
ENV REACT_APP_PUBLIC_URL /web

WORKDIR /usr/src/app
COPY package.json yarn.lock ./
COPY yarn.lock ./
RUN yarn install --pure-lockfile
COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.13.9-alpine
RUN rm -rf /etc/nginx/conf.d
COPY nginx/conf /etc/nginx
COPY --from=builder /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
