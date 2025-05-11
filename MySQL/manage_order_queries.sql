SELECT orderID, clientName, quantity, totalPrice, purchaseDate, shippingAddress, orderStatus
FROM (
	SELECT Orders.orderID, CONCAT(Users.name, " ", Users.surname) as clientName, ItemOrder.quantity, ItemOrder.totalPrice, Orders.purchaseDate, CONCAT(Address.city, ", ", Address.country) as shippingAddress, Orders.orderStatus
    FROM Orders
    JOIN ItemOrder ON Orders.orderID = ItemOrder.orderID
    JOIN Users ON Orders.userID = Users.userID
    JOIN Shipping ON Orders.orderID = Shipping.orderID
    JOIN Address ON Shipping.destinationAddressID = Address.addressID
    ) AS OrderManagementQueries
ORDER BY purchaseDate DESC;

-- Update an order's status 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'
-- PENDING
UPDATE Orders SET orderStatus = 'Pending'
WHERE Orders.orderID = 12345; -- Placeholder Number

-- SUSPENDED
UPDATE Orders SET orderStatus = 'Processing'
WHERE Orders.orderID = 12345; -- Placeholder Number

-- SHIPPED
UPDATE Orders SET orderStatus = 'Shipped'
WHERE Orders.orderID = 12345; -- Placeholder Number

-- DELIVERED
UPDATE Orders SET orderStatus = 'Delivered'
WHERE Orders.orderID = 12345; -- Placeholder Number

-- CANCELLED
UPDATE Orders SET orderStatus = 'Cancelled'
WHERE Orders.orderID = 12345; -- Placeholder Number

-- REFUNDING
UPDATE Orders SET orderStatus = 'Refunding'
WHERE Orders.orderID = 12345; -- Placeholder Number

-- REFUNDED
UPDATE Orders SET orderStatus = 'Refunded'
WHERE Orders.orderID = 12345; -- Placeholder Number

-- Delete any old delivered, cancelled, and refunded orders after 30 days (WIP)
DELETE FROM Orders
WHERE (orderStatus = 'Delivered' OR orderStatus = 'Cancelled' OR orderStatus = 'Refunded')
AND purchaseDate <= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- WIP
