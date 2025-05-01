SELECT month, total_income_completed
FROM (
	SELECT DATE_FORMAT(datetime, '%Y-%m') AS month,
    SUM(totalPrice) as total_income_completed
    FROM Orders
    WHERE orderStatus = 'Delivered' AND YEAR(datetime) = 2025
    GROUP by month) AS IncomeData
ORDER BY month;



SELECT month, total_refund
FROM (
	SELECT DATE_FORMAT(datetime, '%Y-%m') AS month,
    SUM(totalPrice) as total_refund
    FROM Orders
    WHERE orderStatus = 'Refunded' AND YEAR(datetime) = 2025
    GROUP by month) AS IncomeData
ORDER BY month;

SELECT month,
       SUM(CASE WHEN status = 'Delivered' THEN totalPrice ELSE 0 END) 
       - SUM(CASE WHEN status = 'Refunded' THEN totalPrice ELSE 0 END) AS net_income
FROM (
    SELECT DATE_FORMAT(datetime, '%Y-%m') AS month,
           totalPrice,
           orderStatus
    FROM Orders
    WHERE YEAR(datetime) = 2025
) AS IncomeData
GROUP BY month
ORDER BY month;