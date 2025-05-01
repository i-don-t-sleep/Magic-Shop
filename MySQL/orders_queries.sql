SELECT
    (SELECT COUNT(id) FROM Orders WHERE status = 'Delivered') AS Delivered_total_order,
    (SELECT COUNT(id) FROM Orders WHERE status = 'Shipped') AS Shipped_total_order,
    (SELECT COUNT(id) FROM Orders WHERE status = 'Pending') AS Pending_total_order,
    (SELECT COUNT(id) FROM Orders WHERE status = 'Processing') AS Processing_total_order,
    (SELECT COUNT(id) FROM Orders WHERE status = 'Cancelled') AS Cancelled_total_order,
	(SELECT COUNT(id) FROM Orders WHERE status = 'Refunding') AS Refunding_total_order,
    (SELECT COUNT(id) FROM Orders WHERE status = 'Refunded') AS Refunded_total_order,
    (SELECT COUNT(id) FROM Orders) AS total_order;
