import { wish } from "./wish.js";
import { have } from './have.js'
import { apiUser } from "./apiUser.js";

const environment = process.env.DEV_ENVIRONMENT;

if (process.env.DEV_ENVIRONMENT === 'local') {
  try {
    await db.authenticate();
    console.log('Connection has been established successfully.');

    /*dom utkommenterade metoderna nedanför är utkommenterade för försäkra att live-databasen inte skrivs över av misstag
        om du vill sätta upp och populera en lokal databas måste dessa kommenteras in igen
      */

    //await db.sync({ force: true });
    console.log('Tables synchronized successfully.');
    //await populateDB()
    console.log('Inserted succesfully.');
  } catch (error) {
    console.error('Sync error: ', error);
  }
}

export {
    have,
    wish,
    apiUser
}