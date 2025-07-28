require('dotenv').config();
const express = require('express');
const urlRoutes = require('./src/api/routes/shortUrl'); 
const PORT = process.env.PORT || 8080;
const app = express();
app.use(express.json());
app.use('/', urlRoutes); 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});