const express = require('express');
const promClient = require('prom-client');
const winston = require('winston');

const app = express();
const port = 3000;

// Setup Winston for logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.Console()
    ],
});

// Create a registry for Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

// Example metric
const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'code'],
    buckets: [50, 100, 200, 300, 400, 500, 1000]
  });
  register.registerMetric(httpRequestDurationMicroseconds);

  // Middleware to measure request duration
app.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      end({ method: req.method, route: req.route ? req.route.path : '', code: res.statusCode });
    });
    next();
  });

  // Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).send('OK');
  });
  
  // Prometheus metrics endpoint
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  
  // Basic endpoint
  app.get('/', (req, res) => {
    res.send('Hello World!');
  });
  
  app.listen(port, () => {
    logger.info(`App listening at http://localhost:${port}`);
  });