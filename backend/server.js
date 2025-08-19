require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/TransactionRoutes'));
app.use('/api/categories', require('./routes/CategoryRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));

app.get('/', (req, res) => res.send('Finance Tracker API running!!'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));