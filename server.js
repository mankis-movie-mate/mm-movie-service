const app = require('./app');
const { port, base_url } = require('./app/config/config');
require('./app/config/db.js');
const logger = require('./app/middleware/logger');

app.listen(port, () => {
  logger.info(`Server started at: http://localhost:${port}${base_url}`);
  logger.info(
    `API documentation at: http://localhost:${port}${base_url}/api-docs`
  );
});
