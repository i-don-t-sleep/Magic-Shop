SELECT fullName, email, location, joinDate, accountStatus
FROM (
	SELECT CONCAT(Users.name, " ", Users.surname) as fullName, EmailAddress.email, CONCAT(Address.city, ", ", Address.country) as location, Users.joinDate, Users.accountStatus
    FROM Users
    JOIN ContactInfo ON Users.defaultContactInfoID = ContactInfo.contactInfoID
    JOIN EmailAddress ON ContactInfo.defaultEmailAddressID = EmailAddress.emailAddressID
    JOIN Address ON ContactInfo.defaultAddressID = Address.addressID
) AS UserManagementQueries
ORDER BY fullName;

-- Update an user's status
-- ACTIVE
UPDATE Users SET accountStatus = 'Active'
WHERE Users.userID = 12345; -- Placeholder Number

-- SUSPENDED
UPDATE Users SET accountStatus = 'Suspended'
WHERE Users.userID = 12345; -- Placeholder Number

-- DEACTIVATED
UPDATE Users SET accountStatus = 'Deactivated'
WHERE Users.userID = 12345; -- Placeholder Number

-- WIP