import 'dotenv/config';
import app from './app';
import { migrate } from './db/migrate';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// Run migrations then start the server
migrate()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`[server] TrackSphere API running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to run migrations:', err);
    process.exit(1);
  });

