# Hackaton Game

Browser game workspace for the main hackathon project.

## Stack

- Client: Vite, React, TypeScript
- Server: Node.js, Express, TypeScript
- Package management: npm workspaces
- Runtime split: Vite dev server for the client, classic Express server for API and production static hosting

## Commands

```powershell
npm install
npm run dev
```

Development URLs:

- Client: `http://localhost:5173`
- Server: `http://localhost:3001`
- Health check: `http://localhost:3001/api/health`

Production check:

```powershell
npm run build
$env:NODE_ENV = "production"; npm start
```
