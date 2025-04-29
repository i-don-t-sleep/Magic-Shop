SELECT fullName, productName, review, score, timeDate
FROM (
	SELECT CONCAT(Users.name, " ", Users.surname) as fullName, Products.name, Reviews.comment as review, Reviews.score, Reviews.timeDate
    FROM Reviews
    JOIN Users ON Reviews.userID = Users.userID
    JOIN Products ON Reviews.productID = Products.productID
) AS ReviewQueries
ORDER BY timeDate;
