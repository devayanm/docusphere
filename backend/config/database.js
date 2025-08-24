import { Sequelize } from 'sequelize';

// Use environment variable or default for development
const DATABASE_URL = process.env.DATABASE_URL || 'postgres://username:password@localhost:5432/docusphere';

const sequelize = new Sequelize(DATABASE_URL, {
  dialect: 'postgres', // Change to 'mysql', 'sqlite', etc. based on your database
  logging: console.log, // Set to false to disable SQL query logging
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export default sequelize;