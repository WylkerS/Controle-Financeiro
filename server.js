const express = require('express');
const path = require('path');
const db = require('./infra/database');
const seedDatabase = require('./seeders/seed');

const HomeController = require('./controllers/HomeController');
const AccountRouter = require('./routes/accountRoutes');
const CategoryRouter = require('./routes/categoryRoutes');
const TransactionRouter = require('./routes/transactionRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/categories', CategoryRouter);
app.use('/accounts', AccountRouter);
app.use('/transactions', TransactionRouter);

app.get('/', HomeController.renderHome)

db.syncDatabase()
    .then(() => {
        return seedDatabase(); 
    })
    .then(() => {
        db.testConnection(); 
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Database synchronization error:', err);
    });