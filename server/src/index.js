const appModule = require('./app');
// Support both shapes: module.exports = app (with connectDB attached) or
// module.exports = { app, connectDB }
const app = appModule.app || appModule;
const connectDB = appModule.connectDB || appModule.connectDB || (async () => {});

const PORT = process.env.PORT || 5000;

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();