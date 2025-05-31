# Database Design for Online Marketplace

## Entity-Relationship Diagram (Textual Description)

We have the following entities and relationships:

1.  **`Sellers` Entity:**
    *   Attributes: `seller_id` (PK), `name`, `email`, `contact_information`
2.  **`Categories` Entity:**
    *   Attributes: `category_id` (PK), `name`
3.  **`Products` Entity:**
    *   Attributes: `product_id` (PK), `name`, `description`, `price`, `location`, `category_id` (FK), `seller_id` (FK)
4.  **`Customers` Entity:**
    *   Attributes: `customer_id` (PK), `name`, `email`, `contact_information`
5.  **`Orders` Entity:**
    *   Attributes: `order_id` (PK), `order_date`, `order_total`, `payment_method`, `customer_id` (FK)
6.  **`Order_Items` Entity (Junction Table):**
    *   Attributes: `order_item_id` (PK), `order_id` (FK), `product_id` (FK), `quantity`, `order_price`

**Relationships:**

*   **`Sellers` to `Products` (One-to-Many):**
    *   One `Seller` can list many `Products`.
    *   Represented by `seller_id` in `Products` referencing `Sellers`.
*   **`Categories` to `Products` (One-to-Many):**
    *   One `Category` can have many `Products`.
    *   Represented by `category_id` in `Products` referencing `Categories`.
*   **`Customers` to `Orders` (One-to-Many):**
    *   One `Customer` can place many `Orders`.
    *   Represented by `customer_id` in `Orders` referencing `Customers`.
*   **`Orders` to `Products` (Many-to-Many, via `Order_Items`):**
    *   One `Order` can contain many `Products`.
    *   One `Product` can be part of many `Orders`.
    *   This is resolved by the `Order_Items` table:
        *   `Order_Items` has a many-to-one relationship with `Orders` (via `order_id`).
        *   `Order_Items` has a many-to-one relationship with `Products` (via `product_id`).

## First Normalization Form (1NF)

A table is in 1NF if all its attributes are atomic, meaning each cell contains a single value, and there are no repeating groups.

Our tables:

*   **`Categories` Table:**
    *   `category_id`: Atomic
    *   `name`: Atomic
    *   *1NF satisfied.*

*   **`Sellers` Table:**
    *   `seller_id`: Atomic
    *   `name`: Atomic
    *   `email`: Atomic
    *   `contact_information`: Atomic (single text block)
    *   *1NF satisfied.*

*   **`Products` Table:**
    *   `product_id`: Atomic
    *   `name`: Atomic
    *   `description`: Atomic
    *   `price`: Atomic
    *   `category_id`: Atomic
    *   `location`: Atomic
    *   `seller_id`: Atomic
    *   *1NF satisfied.*

*   **`Customers` Table:**
    *   `customer_id`: Atomic
    *   `name`: Atomic
    *   `email`: Atomic
    *   `contact_information`: Atomic
    *   *1NF satisfied.*

*   **`Orders` Table:**
    *   `order_id`: Atomic
    *   `customer_id`: Atomic
    *   `order_date`: Atomic
    *   `order_total`: Atomic
    *   `payment_method`: Atomic
    *   *1NF satisfied.*

*   **`Order_Items` Table:**
    *   `order_item_id`: Atomic
    *   `order_id`: Atomic
    *   `product_id`: Atomic
    *   `quantity`: Atomic
    *   `order_price`: Atomic
    *   *1NF satisfied.*

All tables in the designed schema satisfy the conditions of the First Normalization Form.
