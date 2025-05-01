SELECT clientName, location, totalAmount, paymentDatetime, transactionStatus
FROM (
	SELECT CONCAT(Users.name, " ", Users.surname) as clientName, CONCAT(Address.city, ", ", Address.country) as location, Orders.totalPrice as totalAmount, Orders.purchaseDate as paymentDatetime, Orders.orderStatus as transactionStatus
    FROM Users
    JOIN Orders ON Orders.orderID = Users.orderID
    JOIN Address ON Orders.shippingAddressID = Address.addressID
    ) AS TransactionManagementQueries
ORDER BY paymentDatetime DESC;

-- WIP
