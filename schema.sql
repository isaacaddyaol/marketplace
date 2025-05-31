-- schema.sql content (for clarity, already exists in the root)

-- Drop tables if they exist (optional, for clean setup)
DROP TABLE IF EXISTS Order_Items;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Customers; -- Assuming 'Customers' table is used for users
DROP TABLE IF EXISTS Sellers;


-- Create the Categories table
CREATE TABLE Categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

-- Insert initial categories
INSERT INTO Categories (name) VALUES
    ('Home Décor'),
    ('Jewelry'),
    ('Clothing');

-- Create the Sellers table
-- For now, we might simplify and assume Sellers are also Customers (users)
-- or create a distinct Sellers table if sellers have different attributes beyond what's in Customers.
-- Based on original plan, Sellers are distinct.
CREATE TABLE Sellers (
    seller_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact_information TEXT
    -- If sellers log in, they might also need a password, or link to a user account.
    -- For simplicity in Phase 1, we kept user login to the 'Customers' table.
    -- We'll need to decide if a Seller IS A Customer or a separate entity for login.
    -- Let's assume for now a seller might be a customer with selling privileges,
    -- or we use the customer_id from Customers as the seller_id if a customer becomes a seller.
    -- The original schema had them separate, so let's stick to that.
    -- We'll need a way to link an authenticated user (Customer) to a Seller profile if they are to manage products.
);

-- Create the Customers table (used for user authentication)
CREATE TABLE Customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- For storing hashed passwords
    contact_information TEXT
);

-- Create the Products table
CREATE TABLE Products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    location VARCHAR(255),
    seller_id INT NOT NULL, -- This will link to the Sellers table
    FOREIGN KEY (category_id) REFERENCES Categories(category_id),
    FOREIGN KEY (seller_id) REFERENCES Sellers(seller_id)
);

-- Create the Orders table
CREATE TABLE Orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_total DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'PayPal',
    FOREIGN KEY (customer_id) REFERENCES Customers(customer_id)
);

-- Create the Order_Items table
CREATE TABLE Order_Items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    order_price DECIMAL(10, 2) NOT NULL, -- Price of the product at the time of order
    FOREIGN KEY (order_id) REFERENCES Orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT, -- Or CASCADE if products can be deleted while in orders
    UNIQUE (order_id, product_id)
);
