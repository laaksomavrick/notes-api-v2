# Build step
FROM node:12 AS builder
WORKDIR /home/node/app
COPY . .
RUN yarn cache clean --force
RUN yarn install
RUN yarn build

# Run step
FROM node:12-alpine
ENV NODE_ENV production
ENV PORT 3000
WORKDIR /home/node/app
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules ./node_modules
EXPOSE 3000
CMD node dist/src/index.js
