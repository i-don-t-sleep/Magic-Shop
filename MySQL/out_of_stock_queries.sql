SELECT category, product_name, COUNT(*) AS number_out_of_stock
FROM (
    SELECT Products.category, Products.name AS product_name
    FROM Products
    WHERE Products.status = 'Out of Stock'
) AS OutOfStockProducts
GROUP BY category, product_name;