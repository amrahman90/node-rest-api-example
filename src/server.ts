import sequelize from "./db/config";

function dbconnect(){
    sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });
}
export { dbconnect };