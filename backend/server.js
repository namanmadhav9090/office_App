require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8000;
const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');


// Middleware for parsing JSON bodies
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/department',departmentRoutes);
app.use('/api/user',userRoutes);

// Catch 404 errors
app.use((req, res, next) => {
    res.status(404).json({ message: 'Not Found' });
});

// Error Handling Middleware
app.use(errorHandler);



// Error Handling Middleware
app.use((err, req, res, next) => {
    // Log the error
    logger.error(err.stack);
  
    // Return a standard error response
    res.status(500).json({
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message
    });
  });

app.use("/",(req,res)=>{
    return res.json({message : "ok"});
});

app.listen(port,()=>{
    console.log(`server is running successfully on port ${port}`);
})