SELECT transactionID, clientName, location, category, totalAmount, paymentMethod, paymentDatetime, transactionStatus
FROM (
	SELECT Transactions.transactionID, CONCAT(Users.name, " ", Users.surname) as clientName, CONCAT(Address.city, ", ", Address.country) as location, Transactions.category, Transactions.totalAmount, Transactions.paymentMethod, Transactions.datetime as paymentDatetime, Transactions.status as transactionStatus
    FROM Transactions
    JOIN Users ON Transactions.userID = Users.userID
    JOIN Orders ON Orders.orderID = Users.orderID
    JOIN PaymentOption ON Transactions.paymentOptionID = PaymentOption.paymentOptionID
    JOIN Address ON Orders.shippingAddressID = Address.addressID
    ) AS TransactionManagementQueries
ORDER BY paymentDatetime DESC;

-- Update a transaction's status 'Failed', 'Pending', 'Complete', 'Cancelled', 'Refund'
-- FAILING
UPDATE Transactions SET status = 'Failed'
WHERE Transactions.transactionID = 12345; -- Placeholder Number

-- PENDING
UPDATE Transactions SET status = 'Pending'
WHERE Transactions.transactionID = 12345; -- Placeholder Number

-- COMPLETE
UPDATE Transactions SET status = 'Complete'
WHERE Transactions.transactionID = 12345; -- Placeholder Number

-- CANCELLED
UPDATE Transactions SET status = 'Cancelled'
WHERE Transactions.transactionID = 12345; -- Placeholder Number

-- REFUND
UPDATE Transactions SET status = 'Refund'
WHERE Transactions.transactionID = 12345; -- Placeholder Number

-- WIP
