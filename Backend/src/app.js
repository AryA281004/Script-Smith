require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const {stripeWebhook} = require('./controllers/payment.controller');

const app = express();

app.post('/api/payment/webhook',
  express.raw({type: 'application/json'}),
  stripeWebhook
); 
  
app.use(cors({
  origin: [
    process.env.FRONTEND_URL ||
    'http://localhost:5173'||
    'https://57106bf4-5173.inc1.devtunnels.ms/'
  ],
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
