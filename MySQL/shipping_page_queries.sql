SELECT shippingID, clientName, sourceAddress, destinationAddress, ETA, statusCode, updatedAt
FROM (
	SELECT Shipping.shippingID, CONCAT(Users.name, " ", Users.surname) as clientName, CONCAT(Address.city, ", ", Address.country) as sourceAddress, CONCAT(Address.city, ", ", Address.country) as destinationAddress, Shipping.estimatedDelivery as ETA, ShipmentTracking.statusCode, ShipmentTracking.updatedAt
    FROM Shipping
    JOIN Users ON Users.userID = Shipping.userID
    JOIN Orders ON Shipping.orderID = Orders.orderID
    JOIN ShipmentTracking ON ShipmentTracking.shippingID = Shipping.shippingID
    JOIN Address ON Shipping.sourceAddressID = Address.addressID AND Shipping.destinationAddressID = Address.addressID
    ORDER BY ShipmentTracking.updatedAt DESC
    ) AS shippingQueries;
    
-- Update an shipmentTracking's status 'Order_Received', 'Processed', 'Packaging', 'Shipped', 'In_Transit', 'Out_For_Delivery', 'Waiting_Pickup', 'Delivered', 'Failed_Delivery', 'Returned'
-- Order_Received
UPDATE ShipmentTracking SET statusCode = 'Order_Received'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Processed
UPDATE ShipmentTracking SET statusCode = 'Processed'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Packaging
UPDATE ShipmentTracking SET statusCode = 'Packaging'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Shipped
UPDATE ShipmentTracking SET statusCode = 'Shipped'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- In_Transit
UPDATE ShipmentTracking SET statusCode = 'In_Transit'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Out_For_Delivery
UPDATE ShipmentTracking SET statusCode = 'Out_For_Delivery'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Waiting_Pickup
UPDATE ShipmentTracking SET statusCode = 'Waiting_Pickup'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Delivered
UPDATE ShipmentTracking SET statusCode = 'Delivered'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Failed_Delivery
UPDATE ShipmentTracking SET statusCode = 'Failed_Delivery'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number

-- Returned
UPDATE ShipmentTracking SET statusCode = 'Returned'
WHERE ShipmentTracking.shippingID = 12345; -- Placeholder Number
    
-- Delete any old delivered, cancelled, and refunded orders after 30 days (WIP)
DELETE FROM shippingQueries
WHERE (statusCode = 'Delivered' OR statusCode = 'Failed_Delivery' OR statusCode = 'Returned')
AND updatedAt <= DATE_SUB(NOW(), INTERVAL 30 DAY);

-- WIP
