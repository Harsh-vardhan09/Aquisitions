FROM node:22-slim

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY src ./src
RUN mkdir logs && chown node:node logs

USER node
EXPOSE 3000
CMD ["npm","start"]
