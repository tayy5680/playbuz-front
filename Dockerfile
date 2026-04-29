FROM node:16.4.0 AS build-stage
WORKDIR /app
COPY . .
ARG SITE
ARG COUNTRY
ARG STAGE
ENV STAGE ${STAGE}
ENV COUNTRY ${COUNTRY}
ENV SITE ${SITE}

RUN npm run setup
RUN npm run build:${SITE}-${COUNTRY}-${STAGE}

FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]