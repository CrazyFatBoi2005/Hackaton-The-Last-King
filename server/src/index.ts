import cors from 'cors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = Number(process.env.PORT ?? 3001);
const isProduction = process.env.NODE_ENV === 'production';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    service: 'hackaton-game-server',
    time: new Date().toISOString()
  });
});

if (isProduction) {
  app.use(express.static(clientDistPath));

  app.use((_request, response) => {
    response.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
