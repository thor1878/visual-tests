import pgPromise from 'pg-promise';

const options = {}
const pgp = pgPromise(options);

const db = pgp(process.env.DB_CONN_STRING);

export default db;