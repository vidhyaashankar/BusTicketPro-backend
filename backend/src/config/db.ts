import Database from "better-sqlite3";

const db = new Database("bus_tickets.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'USER',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    passengerName TEXT NOT NULL,
    route TEXT NOT NULL,
    seatNumber TEXT NOT NULL,
    departureTime TEXT NOT NULL,
    fare REAL NOT NULL,
    status TEXT DEFAULT 'BOOKED',
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(route, seatNumber, departureTime),
    FOREIGN KEY (userId) REFERENCES users(id)
  );
`);

export default db;
