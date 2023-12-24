FROM node:19-alpine AS build

COPY ./local-entrypoint.sh /app/

WORKDIR app/

EXPOSE 3000 49153
ENTRYPOINT ["sh", "local-entrypoint.sh"]