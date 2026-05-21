-- BROKEN SCHEMA - Intentional syntax error for E2E rollback testing
CREATE TABLE IF NOT EXISTS vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL
);

INVALID SYNTAX HERE SHOULD FAIL;

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER NOT NULL REFERENCES nonexistent_table(id),
  name VARCHAR(300) NOT NULL
);
