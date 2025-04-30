CREATE DATABASE MagicShopDB;

-- Create the 'Users' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    age INT,
    birthday DATE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    accountStatus ENUM('Active', 'Suspended', 'Deactivated') NOT NULL,
    profilePicture VARCHAR(100),
    role ENUM('Customer', 'Carrier', 'Data Entry Admin', 'Super Admin') NOT NULL,
    joinDate TIMESTAMP NOT NULL,
    modifyDate TIMESTAMP NOT NULL,
    lastLogin TIMESTAMP NOT NULL,
    defaultPaymentMethod ENUM('Credit/Debit', 'E-Wallet', 'Banking', 'Cash'),
    defaultContactInfoID INT,

    FOREIGN KEY (defaultContactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'Publishers' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Publishers (
    publisherID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    logoSource TEXT,
    defaultContactInfoID INT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (defaultContactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'Transactions' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Transactions (
    transactionID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    name VARCHAR(100),
    totalAmount DEC(14,2) NOT NULL, 
    status ENUM('Failed', 'Pending', 'Complete', 'Cancelled', 'Refund') NOT NULL, 
    paymentMethod ENUM('Credit/Debit', 'E-Wallet', 'Banking', 'Cash') NOT NULL, 
    datetime TIMESTAMP, 
    category ENUM('Order Payment', 'Refund', 'Cash on Delivery', 'Shipping Charge', 'Discount/Coupon Applied', 'Cancellation Fee'),
    paymentOptionID INT,

    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (paymentOptionID) REFERENCES PaymentOption(paymentOptionID)
);

-- Create the 'PublisherImages' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE PublisherImages (
    publisherImageID INT AUTO_INCREMENT PRIMARY KEY,
    publisherID INT,
    noImage INT UNIQUE NOT NULL,
    name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    source TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID)
);

-- Create the 'Products' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Products (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DEC(15, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    category ENUM('Rulebook', 'Miniature', 'Dice', 'Game Aid', 'Digital Content', 'Merchandise', 'Custom Content'),
    status ENUM('Available', 'Out of Stock') NOT NULL,
    publisherID INT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID)
);

-- Create the 'ProductImages' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ProductImages (
    productImageID INT AUTO_INCREMENT PRIMARY KEY,
    publisherID INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    source VARCHAR(200) NOT NULL,
    isPrimary BOOLEAN DEFAULT False,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID)
);

-- Create the 'Orders' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    transactionID INT,
    totalPrice DEC(20,2) NOT NULL,
    orderStatus ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'),
    shippingAddressID INT,
    purchaseDate TIMESTAMP,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (transactionID) REFERENCES Transactions(transactionID),
    FOREIGN KEY (shippingAddressID) REFERENCES Address(addressID)
);

-- Create the 'ItemOrder' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ItemOrder (
    itemOrderID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT,
    publisherID INT,
    noItem INT UNSIGNED NOT NULL,
    totalPrice DEC(20, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID)
);

-- Create the 'PaymentOption' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE PaymentOption (
    paymentOptionID INT AUTO_INCREMENT PRIMARY KEY,
    method ENUM('Credit/Debit', 'E-Wallet', 'Banking', 'etc...') NOT NULL,
    code VARCHaR(50),
    description TEXT,
    icon TEXT,
    processingFee DEC(10,2),
    processingFeeType ENUM('Percent', 'Constant'),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

-- Create the 'ContactInfo' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ContactInfo (
    contactInfoID INT AUTO_INCREMENT PRIMARY KEY,
    noContact INT UNSIGNED UNIQUE NOT NULL, 
    entityType ENUM('User', 'Publisher') NOT NULL,
    entityID INT, -- UserID / publisherID
    companyName VARCHAR(100),  
    description TEXT,
    defaultEmailAddressID INT,
    defaultPhoneNumberID INT,
    defaultAddressID INT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (defaultEmailAddressID) REFERENCES EmailAddress(emailAddressID),
    FOREIGN KEY (defaultPhoneNumberID) REFERENCES PhoneNumber(phoneNumberID),
    FOREIGN KEY (defaultAddressID) REFERENCES Address(addressID)
);

-- Create the 'Couriers' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Couriers (
    courierID INT AUTO_INCREMENT PRIMARY KEY,
    courierName VARCHAR(100) NOT NULL,
    contactPhone VARCHAR(20),
    contactEmail VARCHAR(20),
    averageDeliveryTime VARCHAR(20),
    isActive BOOLEAN DEFAULT True,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP
);

-- Create the 'Shipping' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Shipping (
    shippingID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT,
    transactionID INT,
    userID INT,
    publisherID INT,
    shippingMethod VARCHAR(20),
    trackingNumber VARCHAR(20),
    shippingStatus ENUM('Processing', 'Shipped', 'Delivered') NOT NULL,
    shippingDate TIMESTAMP,
    estimatedDelivery TIME,
    actualDeliveryDate TIMESTAMP,
    courierID INT,
    sourceAddressID INT,
    destinationAddressID INT, 
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (transactionID) REFERENCES Transactions(transactionID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID),
    FOREIGN KEY (courierID) REFERENCES Couriers(courierID),
    FOREIGN KEY (sourceAddressID, destinationAddressID) REFERENCES Address(addressID)
);

-- Create the 'Reviews' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Reviews (
    reviewID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    productID INT,
    timeDate TIMESTAMP,
    comment TEXT,
    score DEC(2, 1),

    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Create the 'EmailAddress' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE EmailAddress (
    emailAddressID INT AUTO_INCREMENT PRIMARY KEY,
    contactInfoID INT,
    email VARCHAR(20) NOT NULL,
    emailType ENUM('Personal', 'Work', 'Support', 'Billing'),
    isPrimary BOOLEAN DEFAULT False,
    isVerified BOOLEAN DEFAULT False,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (contactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'PhoneNumber' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE PhoneNumber (
    phoneNumberID INT AUTO_INCREMENT PRIMARY KEY,
    contactInfoID INT,
    phoneType ENUM('Mobile', 'Home', 'Office', 'Fax'),
    phoneNumber VARCHAR(20) NOT NULL,
    phoneExtension VARCHAR(4),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (contactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'Address' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Address (
    addressID INT AUTO_INCREMENT PRIMARY KEY,
    contactInfoID INT,
    addressLine1 TEXT NOT NULL,
    addressLine2 TEXT,
    district VARCHAR(50),
    subDistrict VARCHAR(50),
    city VARCHAR(50),
    postalCode VARCHAR(10),
    country VARCHAR(20),
    addressType ENUM('Shipping', 'Billing', 'Home', 'Work'),
    latitude DEC(10,10),
    longitude DEC(10,10),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (contactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'ShipmentTracking' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ShipmentTracking (
    shipmentTrackingID INT AUTO_INCREMENT PRIMARY KEY,
    shippingID INT,
    orderID INT,
    statusCode ENUM('Order_Received', 'Processed', 'Packaging', 'Shipped', 'In_Transit', 'Out_For_Delivery', 'Waiting_Pickup', 'Delivered', 'Failed_Delivery', 'Returned') NOT NULL,
    location TEXT,
    description TEXT,
    timeDate TIMESTAMP NOT NULL,
    latitude DEC(10,10),
    longitude DEC(10,10),
    updatedBy INT,
    estimatedNextUpdate TIMESTAMP,
    courierNotes TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (shippingID) REFERENCES Shipping(shippingID),
    FOREIGN KEY (updatedBy) REFERENCES Users(userID),
    FOREIGN KEY (shippingID) REFERENCES Shipping(shippingID)
);

-- Create the 'ShipmentHistory' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ShipmentHistory (
    shipmentHistoryID INT AUTO_INCREMENT PRIMARY KEY,
    shippingID INT,
    trackingID INT,
    previousStatus ENUM('Order_Received', 'Processed', 'Packaging', 'Shipped', 'In_Transit', 'Out_For_Delivery', 'Waiting_Pickup', 'Delivered', 'Failed_Delivery', 'Returned'),
    newStatus ENUM('Order_Received', 'Processed', 'Packaging', 'Shipped', 'In_Transit', 'Out_For_Delivery', 'Waiting_Pickup', 'Delivered', 'Failed_Delivery', 'Returned'),
    changeTimestamp TIMESTAMP NOT NULL,
    durationMinutes INT,
    reasonForChange TEXT,
    changedBy INT,
    updatedAt TIMESTAMP,

    FOREIGN KEY (shippingID) REFERENCES Shipping(shippingID),
    FOREIGN KEY (trackingID) REFERENCES ShipmentTracking(shipmentTrackingID),
    FOREIGN KEY (changedBy) REFERENCES Users(userID)
);

-- Create the 'ShipmentCheckpoints' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ShipmentCheckpoints (
    shipmentCheckpointID INT AUTO_INCREMENT PRIMARY KEY,
    shippingID INT,
    checkpointName VARCHAR(100) NOT NULL,
    checkpointType ENUM('Origin', 'Sorting_Center', 'Distribution_Center', 'Local_Hub', 'Destination'),
    addressID INT,
    arrivalTime TIMESTAMP,
    departureTime TIMESTAMP,
    processingTime INT,
    notes TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,

    FOREIGN KEY (shippingID) REFERENCES Shipping(shippingID),
    FOREIGN KEY (addressID) REFERENCES Address(addressID)
);