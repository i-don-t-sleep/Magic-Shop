SELECT fullName, email, location, joinDate, role
FROM (
	SELECT CONCAT(Users.name, " ", Users.surname) as fullName, EmailAddress.email, CONCAT(Address.city, ", ", Address.country) as location, Users.joinDate, Users.role
    FROM Users
    JOIN ContactInfo ON Users.contactInfoID = ContactInfo.contactInfoID
    JOIN EmailAddress ON ContactInfo.defaultEmailAddress = EmailAddress.email
    JOIN Address ON ContactInfo.defaultAddressID = Address.addressID
    WHERE role = 'Data Entry Admin' OR role = 'Super Admin'
) AS AdminManagementQueries
ORDER BY fullName;

-- Update an user's role
-- Data Entry Admin
UPDATE Users SET accountStatus = 'Data Entry Admin'
WHERE Users.userID = 12345; -- Placeholder Number

-- Super Admin
UPDATE Users SET accountStatus = 'Super Admin'
WHERE Users.userID = 12345; -- Placeholder Number

-- Customer (Demotion)
UPDATE Users SET accountStatus = 'Customer'
WHERE Users.userID = 12345; -- Placeholder Number

-- WIP