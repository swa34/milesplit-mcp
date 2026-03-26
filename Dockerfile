FROM node:22-slim

WORKDIR /app

# Install server deps
COPY server/package.json server/package-lock.json ./server/
RUN cd server && npm ci

# Install website deps + build
COPY website/package.json website/package-lock.json ./website/
RUN cd website && npm ci
COPY website/ ./website/
RUN cd website && npm run build

# Copy server source
COPY server/ ./server/

# Copy top-level files
COPY milesplit-api-reference.md ./

WORKDIR /app/server

ENV MCP_MODE=http
EXPOSE ${PORT:-3000}

CMD ["npx", "tsx", "src/index.ts"]
