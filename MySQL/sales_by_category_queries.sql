SELECT category, total_purchases
FROM (
	SELECT Products.category, SUM(ItemOrder.quantity) AS total_purchases
    FROM Orders
    JOIN ItemOrder ON Orders.id = ItemOrder.orderID
    JOIN Products ON Products.id = ItemOrder.productID
    WHERE Orders.orderStatus = 'Delivered'
    GROUP BY Products.category
) AS CategoryProducts
ORDER BY total_purchases;