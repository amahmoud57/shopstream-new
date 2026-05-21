-- BROKEN SCHEMA - Intentional syntax error for E2E rollback testing
CREATE TABLE IF NOT EXISTS vendors (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(200) NOT NULL,
  slug          VARCHAR(200) NOT NULL UNIQUE
);

-- This is invalid SQL that will break the migration
INVALID SYNTAX HERE SHOULD FAIL;

CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  vendor_id     INTEGER NOT NULL REFERENCES vendors_that_doesnt_exist(id),
  name          VARCHAR(300) NOT NULL
);
