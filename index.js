import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path'; 
import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js ';
import authRoutes from './routes/authRoutes.js';
import sql from 'mssql';
import configMSSQL from './config/dbMSSQL.js';
import os from 'os';

// Initialize express App 
const app = express(); 

// Connect MONGODB
//connectDB();

//HOST name

const hostname = os.hostname();
console.log('Hostname:', hostname);

const connectSQLDB = async () => {
  try {
    let pool = await sql.connect(configMSSQL);
  } catch (error) {
    console.log('MSSQL ERROR: ', error);
  }
};

//connectSQLDB();



// Middleware to handle CORS
app.use(
   cors({
    origin: '*',
    methods: ['GET','POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
   }) 
)

app.use(express.json());
app.use(express.urlencoded({ extended: true}));  

//Routes
app.use('/api/auth', authRoutes)
app.use(errorHandler)


// 404 Not found
app.use((req, res) =>{
  res.status(404).json({
    success:false,
    error: 'Route not found',
    statusCode:404
  });
})

async function runQuery(query) {
    try {
        await sql.connect(configMSSQL);
        const result = await sql.query(query);
        console.log('RESULT: ', result);
        return result.recordset;
    } catch (err) {
        console.error('Database query error: ', err);
        throw err;
    } finally {
        // Ensure the connection is closed after the request is finished
        sql.close();
    }
}

// Define a route to fetch data
app.get('/data', async (req, res) => {
    try {
        const students = await runQuery('SELECT * FROM dbo.COBRO'); // Replace 'Student' with your table name
        res.json(students);
    } catch (err) {
        res.status(500).send('Error fetching data');
    }
});
 

//Start server
const PORT= process.env.PORT || 8000; 
app.listen(PORT, ()=>{
  console.log(`Server running in ${process.env.NODE_ENV } node on port ${PORT  }`); 
});

process.on('unhandledRejection', (err)=>{
  console.error(`Error: ${err.message}`); 
  process.exit(1);
}); 