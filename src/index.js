import 'dotenv/config'; // Ensure environment variables are loaded
import sequelize from './db/index.js';
import  './models/index.js'; // Import all models
import { app } from './app.js';
import chalk from 'chalk';




const connectDB = async () => {
  console.log(chalk.bgWhite("Connecting to database..."));
  try {
    await sequelize.authenticate();
    console.log(chalk.bgGreen('Connection to database has been established successfully.'));
    console.log(chalk.bgWhite("Wait....Now Synchronzing models..."));


    // Sync all models
    try {
      await sequelize.sync(); // force: true will drop the table if it already exists
      console.log(chalk.bgGreen('All models were synchronized successfully.'));
      console.log(chalk.bgWhite("Wait....Now starting the Node server..."));

      app.listen(process.env.PORT || 8000, () => {
        console.log(chalk.bgGreen(`App is running on port http://localhost:${process.env.PORT}`));
        console.log(chalk.bgMagenta("Go ahead and test the API using Postman or any other tool"));
    });
    } catch (error) {
      console.error(chalk.bgRedBright('Error synchronizing models:', error));
    }
  
  } catch (error) {
    console.error(chalk.bgRedBright('Unable to connect to the database:', error));
  }
};

app.on("error", (error) => {
  console.error(chalk.bgRedBright(`Express error: ${error}`));
});

// Global error handling for the app
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).status(chalk.bgRedBright('Something broke!', err));
});

connectDB();
