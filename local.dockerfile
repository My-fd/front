FROM node:20.11.0-bookworm AS build

COPY ./local-entrypoint.sh /app/

WORKDIR app/

EXPOSE 3000 49153
ENTRYPOINT ["sh", "local-entrypoint.sh"]
