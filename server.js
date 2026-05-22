const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const mongoHost = process.env.MONGO_HOST || 'mongodb-service';
const mongoUrl = `mongodb://admin:password@${mongoHost}:27017`;
const dbName = "user-account";
const collectionName = "users";
app.get('/get-proconst express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const client = require('prom-client');
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [register]
});

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestsTotal.inc({ method: req.method, route: req.route?.path || req.path, status: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route: req.route?.path || req.path }, duration);
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
app.use(express.static(__dirname));
const mongoHost = process.env.MONGO_HOST || 'mongodb-service';
const mongoUrl = `mongodb://admin:password@${mongoHost}:27017`;
const dbName = "user-account";
const collectionName = "users";
app.get('/get-profile', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const result = await db.collection(collectionName).findOne({ userid: 1 });
    client.close();
    res.json(result || { userid: 1, name: "", email: "", age: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post('/update-profile', async (req, res) => {
  try {
    const client = await MongoClient.connect(mongoUrl);
    const db = client.db(dbName);
    const userData = { ...req.body, userid: 1 };
    await db.collection(collectionName).updateOne(
      { userid: 1 },
      { $set: userData },
      { upsert: true }
    );
    client.close();
    res.json(userData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`MongoDB: ${mongoUrl}`);
});
