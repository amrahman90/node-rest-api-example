import { Sequelize } from 'sequelize-typescript';
import { User } from '../models/User';
import { Token } from '../models/Token';
import { DrumContainer } from '../models/drumcontainer';

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // Replace with the path to your SQLite database file
  logging: true, // Set to true if you want to see SQL queries in the console
  models: [User, Token,DrumContainer],
});

sequelize
.sync({ force: false }) // Set force: false to disable automatic table recreation
.then(() => {
  console.log('Database synchronized');
  // ...
})
  .catch((error) => {
    console.error('Unable to synchronize the database:', error);
});

export default sequelize;
