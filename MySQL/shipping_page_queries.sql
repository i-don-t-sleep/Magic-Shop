SELECT shippingID, clientName, sourceAddress, destinationAddress, ETA, statusCode, updatedAt
FROM (
	SELECT Shipping.shippingID, CONCAT(Users.name, " ", Users.surname) as clientName, CONCAT(Address.city, ", ", Address.country) as sourceAddress, CONCAT(Address.city, ", ", Address.country) as destinationAddress, (NOW() - Shipping.actualDeliveryDate) as ETA, Shipping.shippingStatus, Shipping.updatedAt
    FROM Shipping
    JOIN Users ON Users.userID = Orders.userID
    JOIN Orders ON Shipping.orderID = Orders.orderID
    JOIN Address ON Shipping.sourceAddressID = Address.addressID AND Shipping.destinationAddressID = Address.addressID
    ORDER BY Shipment.updatedAt DESC
    ) AS shippingQueries
    ;
    
-- Delete any old delivered, cancelled, and refunded orders after 30 days (WIP)
DELETE shippingEntry
FROM Shipping as shippingEntry JOIN Orders ON Orders.orderID = Shipping.orderID
WHERE (Orders.orderStatus = 'Delivered' OR Orders.orderStatus = 'Cancelled' OR Orders.orderStatus = 'Refunded')
AND shippingEntry.updatedAt <= DATE_SUB(NOW(), INTERVAL 30 DAY);
-- Not sure whether this will work

-- WIP
