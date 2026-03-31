require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const {stripeWebhook} = require('./controllers/payment.controller');

const app = express();

const normalizeOrigin = (origin = '') => origin.replace(/\/+$/, '');

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://57106bf4-5173.inc1.devtunnels.ms/',
]
  .filter(Boolean)
  .map(normalizeOrigin);

app.post('/api/payment/webhook',
  express.raw({type: 'application/json'}),
  stripeWebhook
); 
  
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser/server-to-server requests
    if (!origin) return callback(null, true);

    const normalizedRequestOrigin = normalizeOrigin(origin);
    
    // Check against allowed list
    if (allowedOrigins.includes(normalizedRequestOrigin)) {
      return callback(null, true);
    }
    
    // Also allow all Vercel domains (*.vercel.app) for flexibility
    if (normalizedRequestOrigin.endsWith('.vercel.app') || normalizedRequestOrigin === 'http://localhost:5173') {
      return callback(null, true);
    }

    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposedHeaders: ['Content-Disposition'],
}));

app.use(express.json());
app.use(cookieParser()); 
app.use(

  helmet({
    contentSecurityPolicy: false,
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
    crossOriginEmbedderPolicy: false,
  }) 
);


const authRoutes = require('./routes/auth.route');
const userRoutes = require('./routes/user.route');
const noteRoutes = require('./routes/generate.route');
const userNotesRoutes = require('./routes/notes.routes'); 
const paymentRoutes = require('./routes/payment.route');
const settingsRoutes = require('./routes/settings.route');
const connectGmailRoutes = require('./routes/connectgmail.route');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/note', noteRoutes);
app.use('/api/notes', userNotesRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/connectgmail', connectGmailRoutes);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

module.exports = app;
