CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  first_name VARCHAR,
  middle_name VARCHAR,
  last_name VARCHAR,
  category VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  work_phone VARCHAR NOT NULL
);



CREATE TABLE customer_details (
  id SERIAL PRIMARY KEY,
  currency VARCHAR NOT NULL,
  terms VARCHAR NOT NULL,
  amount FLOAT NOT NULL,
  customer_id INTEGER NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);


CREATE TABLE customer_address (
  id SERIAL PRIMARY KEY,
  billing_address VARCHAR NOT NULL,
  billing_city VARCHAR NOT NULL,
  billing_zip FLOAT NOT NULL,
  billing_state VARCHAR NOT NULL,
  billing_country VARCHAR NOT NULL,
  shipping_address VARCHAR NOT NULL,
  shipping_city VARCHAR NOT NULL,
  shipping_zip FLOAT NOT NULL,
  shipping_state VARCHAR NOT NULL,
  shipping_country VARCHAR NOT NULL,
  customer_id INTEGER NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);



CREATE TABLE customer_contact_person (
  id SERIAL PRIMARY KEY,
  contact_first_name VARCHAR NOT NULL,
  contact_last_name VARCHAR NOT NULL,
  contact_email VARCHAR NOT NULL,
  contact_phone VARCHAR NOT NULL,
  contact_job_role VARCHAR NOT NULL,
  customer_id INTEGER NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers (id)
);






CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  first_name VARCHAR,
  middle_name VARCHAR,
  last_name VARCHAR,
  category VARCHAR NOT NULL,
  type VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  work_phone VARCHAR NOT NULL
);



CREATE TABLE vendor_details (
  id SERIAL PRIMARY KEY,
  currency VARCHAR NOT NULL,
  terms VARCHAR NOT NULL,
  amount FLOAT NOT NULL,
  vendor_id INTEGER NOT NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors (id)
);





CREATE TABLE vendor_contact_person (
  id SERIAL PRIMARY KEY,
  contact_first_name VARCHAR NOT NULL,
  contact_last_name VARCHAR NOT NULL,
  contact_email VARCHAR NOT NULL,
  contact_phone VARCHAR NOT NULL,
  contact_job_role VARCHAR NOT NULL,
  vendor_id INTEGER NOT NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors (id)
);

CREATE TABLE vendor_addresses (
  id SERIAL PRIMARY KEY,
  vendor_id INTEGER NOT NULL,
  address_type VARCHAR NOT NULL,
  address_details JSONB,
  FOREIGN KEY (vendor_id) REFERENCES vendors (id)
);


CREATE TABLE item (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  code VARCHAR NOT NULL,
  price FLOAT NOT NULL,
  category VARCHAR NOT NULL,
  status VARCHAR NOT NULL,
  cogs_account VARCHAR NOT NULL,
  inventory_account VARCHAR NOT NULL,
  income_account VARCHAR NOT NULL,
  selected_costing_option VARCHAR NOT NULL,
  selected_vendor VARCHAR NOT NULL,
  drop_shipping BOOLEAN NOT NULL,
  purchase_description TEXT,
  selected_locations TEXT[],
  sales_description TEXT,
  sales_price FLOAT NOT NULL,
  price_level_name VARCHAR NOT NULL,
  qty_1 INT NOT NULL,
  price_1 FLOAT NOT NULL,
  qty_2 INT NOT NULL,
  price_2 FLOAT NOT NULL,
  qty_3 INT NOT NULL,
  price_3 FLOAT NOT NULL,
  qty_4 INT NOT NULL,
  price_4 FLOAT NOT NULL,
  qty_5 INT NOT NULL,
  price_5 FLOAT NOT NULL
);
