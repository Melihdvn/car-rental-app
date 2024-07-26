PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: additional_services
CREATE TABLE "additional_services" ("id" integer primary key autoincrement not null, "name" varchar not null, "price" numeric not null, "created_at" datetime, "updated_at" datetime);

-- Table: migrations
CREATE TABLE "migrations" ("id" integer primary key autoincrement not null, "migration" varchar not null, "batch" integer not null);

-- Table: reservation_services
CREATE TABLE reservation_services (id integer PRIMARY KEY AUTOINCREMENT NOT NULL, reservation_id integer NOT NULL, service_id integer NOT NULL, created_at datetime, updated_at datetime, FOREIGN KEY (reservation_id) REFERENCES reservations (reservation_id) ON DELETE CASCADE, FOREIGN KEY (service_id) REFERENCES additional_services (id) ON DELETE CASCADE);

-- Table: reservations
CREATE TABLE reservations (reservation_id integer PRIMARY KEY AUTOINCREMENT NOT NULL, is_rented tinyint(1), user_id integer NOT NULL, vehicle_id integer NOT NULL, start_date date NOT NULL, end_date date NOT NULL, total_price numeric NOT NULL, created_at datetime, updated_at datetime);

-- Table: users
CREATE TABLE users (user_id integer PRIMARY KEY AUTOINCREMENT NOT NULL, name varchar, email varchar NOT NULL, password varchar NOT NULL, is_active tinyint (1) NOT NULL DEFAULT (1), remember_token varchar, created_at datetime, updated_at datetime);

-- Table: vehicles
CREATE TABLE vehicles (vehicle_id integer PRIMARY KEY AUTOINCREMENT NOT NULL, make varchar NOT NULL, model varchar NOT NULL, fuel varchar NOT NULL, transmission varchar NOT NULL, year integer NOT NULL, kilometers INTEGER, is_active tinyint (1) NOT NULL DEFAULT '1', daily_rate numeric NOT NULL, created_at datetime, updated_at datetime);

-- Table: verification_codes
CREATE TABLE verification_codes (vc_id integer PRIMARY KEY AUTOINCREMENT NOT NULL, email varchar NOT NULL, code varchar NOT NULL, type varchar, created_at datetime, updated_at datetime);

-- Index: users_email_unique
CREATE UNIQUE INDEX users_email_unique ON users ("email");

COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
