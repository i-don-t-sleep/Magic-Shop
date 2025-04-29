SELECT Products.name, Publishers.name, Products.quantity, Products.price, Products.status
FROM Products
JOIN Publishers ON Products.publisherID = Publishers.publisherID;

-- Filter by Categories
SELECT Products.name, Publishers.name, Products.quantity, Products.price, Products.status
FROM Products
JOIN Publishers ON Products.publisherID = Publishers.publisherID
WHERE category = "PLACEHOLDER";

-- Filter by Publishers
SELECT Products.name, Publishers.name, Products.quantity, Products.price, Products.status
FROM Products
JOIN Publishers ON Products.publisherID = Publishers.publisherID
WHERE Publishers.name = "PLACEHOLDER";

-- Search by Product Name
SELECT Products.name, Publishers.name, Products.quantity, Products.price, Products.status
FROM Products
JOIN Publishers ON Products.publisherID = Publishers.publisherID
WHERE Publishers.name LIKE "%PLACEHOLDER%";
