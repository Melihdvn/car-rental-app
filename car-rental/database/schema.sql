--
-- File generated with SQLiteStudio v3.4.4 on Sun Aug 4 22:03:46 2024
--
-- Text encoding used: System
--
PRAGMA foreign_keys = off;
BEGIN TRANSACTION;

-- Table: additional_services
CREATE TABLE additional_services (
    additional_service_id INTEGER  PRIMARY KEY AUTOINCREMENT
                                   NOT NULL,
    name                  VARCHAR  NOT NULL,
    price                 NUMERIC  NOT NULL,
    created_at            DATETIME,
    updated_at            DATETIME
);


-- Table: migrations
CREATE TABLE migrations (
    id        INTEGER PRIMARY KEY AUTOINCREMENT
                      NOT NULL,
    migration VARCHAR NOT NULL,
    batch     INTEGER NOT NULL
);


-- Table: reservation_services
CREATE TABLE reservation_services (
    rs_id                 INTEGER  PRIMARY KEY AUTOINCREMENT
                                   NOT NULL,
    reservation_id        INTEGER  NOT NULL,
    additional_service_id INTEGER  NOT NULL
                                   REFERENCES additional_services (additional_service_id),
    name,
    price,
    created_at            DATETIME,
    updated_at            DATETIME,
    FOREIGN KEY (
        reservation_id
    )
    REFERENCES reservations (reservation_id) ON DELETE CASCADE,
    FOREIGN KEY (
        additional_service_id
    )
    REFERENCES additional_services (additional_service_id) ON DELETE CASCADE
);


-- Table: reservations
CREATE TABLE reservations (
    reservation_id INTEGER     PRIMARY KEY AUTOINCREMENT
                               NOT NULL,
    is_rented      TINYINT (1),
    user_id        INTEGER     NOT NULL,
    vehicle_id     INTEGER     NOT NULL,
    start_date     DATE        NOT NULL,
    end_date       DATE        NOT NULL,
    total_price    NUMERIC     NOT NULL,
    created_at     DATETIME,
    updated_at     DATETIME
);


-- Table: users
CREATE TABLE users (
    user_id        INTEGER     PRIMARY KEY AUTOINCREMENT
                               NOT NULL,
    name           VARCHAR,
    email          VARCHAR     NOT NULL,
    password       VARCHAR     NOT NULL,
    is_active      TINYINT (1) NOT NULL
                               DEFAULT (1),
    remember_token VARCHAR,
    created_at     DATETIME,
    updated_at     DATETIME
);


-- Table: vehicles
CREATE TABLE vehicles (
    vehicle_id   INTEGER     PRIMARY KEY AUTOINCREMENT
                             NOT NULL,
    make         VARCHAR     NOT NULL,
    model        VARCHAR     NOT NULL,
    fuel         VARCHAR     NOT NULL,
    transmission VARCHAR     NOT NULL,
    year         INTEGER     NOT NULL,
    kilometers   INTEGER,
    is_active    TINYINT (1) NOT NULL
                             DEFAULT '1',
    daily_rate   NUMERIC     NOT NULL,
    image,
    created_at   DATETIME,
    updated_at   DATETIME
);


-- Table: verification_codes
CREATE TABLE verification_codes (
    vc_id      INTEGER  PRIMARY KEY AUTOINCREMENT
                        NOT NULL,
    email      VARCHAR  NOT NULL,
    code       VARCHAR  NOT NULL,
    type       VARCHAR,
    created_at DATETIME,
    updated_at DATETIME
);


-- Index: users_email_unique
CREATE UNIQUE INDEX users_email_unique ON users (
    "email"
);


COMMIT TRANSACTION;
PRAGMA foreign_keys = on;
