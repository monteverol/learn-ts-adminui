import app from './app.js';
import { config } from './config/index.js';
app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${config.port}`);
});
