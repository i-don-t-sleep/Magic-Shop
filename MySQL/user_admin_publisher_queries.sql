-- USER
SELECT name, surname, username, birthday, email, phoneNumber, city, country, postalCode, accountStatus, sessionState, 
profilePicture, mimeType, role, lastLogin
FROM (
	SELECT Users.name, Users.surname, Users.username, Users.birthday, EmailAddress.email, PhoneNumber.phoneNumber, 
    Address.city, Address.country, Address.postalCode, Users.accountStatus, Users.sessionState, Users.profilePicture, 
    Users.mimeType, Users.role, Users.lastLogin
    FROM Users
    INNER JOIN ContactInfo ON Users.contactInfoID = ContactInfo.contactInfoID
    INNER JOIN EmailAddress ON ContactInfo.defaultEmailAddressID = EmailAddress.emailID
    INNER JOIN PhoneNumber ON ContactInfo.defaultPhoneNumberID = PhoneNumber.phoneNumberID
    INNER JOIN Address ON ContactInfo.defaultAddressID = Address.addressID
    ) AS UserManagement;

-- ADMIN
SELECT name, surname, username, birthday, email, phoneNumber, accountStatus, sessionState, profilePicture, mimeType, 
role, lastLogin
FROM (
	SELECT Users.name, Users.surname, Users.username, Users.birthday, EmailAddress.email, PhoneNumber.phoneNumber, 
    Users.accountStatus, Users.sessionState, Users.profilePicture, Users.mimeType, Users.role, Users.lastLogin
    FROM Users
    INNER JOIN ContactInfo ON Users.contactInfoID = ContactInfo.contactInfoID
    INNER JOIN EmailAddress ON ContactInfo.defaultEmailAddressID = EmailAddress.emailID
    INNER JOIN PhoneNumber ON ContactInfo.defaultPhoneNumberID = PhoneNumber.phoneNumberID
    WHERE Users.role = 'Data Entry Admin' OR Users.role = 'Super Admin'
    ) AS AdminManagement;

-- PUBLISHER
SELECT name, username, description, x, linkedin, facebook, instagram, email, phoneNumber, city, country, postalCode, accountStatus, sessionState, 
servicesFee
FROM (
	SELECT Publishers.name, Publishers.username, Publishers.description, ContactInfo.x, ContactInfo.linkedin, 
    ContactInfo.facebook, ContactInfo.instagram, EmailAddress.email, PhoneNumber.phoneNumber, Address.city, 
    Address.country, Address.postalCode, Publishers.logoImg, Publishers.mimeType, Publishers.publisherWeb, 
    Publishers.sessionState, Publishers.servicesFee
    FROM Users
    INNER JOIN ContactInfo ON Publishers.contactInfoID = ContactInfo.contactInfoID
    INNER JOIN EmailAddress ON ContactInfo.defaultEmailAddressID = EmailAddress.emailID
    INNER JOIN PhoneNumber ON ContactInfo.defaultPhoneNumberID = PhoneNumber.phoneNumberID
    INNER JOIN Address ON ContactInfo.defaultAddressID = Address.addressID
    ) AS PublisherManagement;
