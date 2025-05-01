CREATE DATABASE MagicShopDB;

-- Create the 'Users' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    surname VARCHAR(100) NOT NULL,
    birthday DATE,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    contactInfoID INT NOT NULL,
    accountStatus ENUM('Active', 'Suspended', 'Deactivated') NOT NULL,
    profilePicture BLOB,
    role ENUM('Customer', 'Carrier', 'Data Entry Admin', 'Super Admin') NOT NULL,
    joinDate TIMESTAMP NOT NULL,
    modifyDate TIMESTAMP NOT NULL,
    lastLogin TIMESTAMP,

    FOREIGN KEY (defaultContactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'Publishers' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Publishers (
    publisherID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password VARCHAR(20) NOT NULL,
    name VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    serviceFee FLOAT(3) DEFAULT 30.00,		-- Store as percentage
    logoIMGSource BLOB,
    publisherWeb TEXT,
    contactInfoID INT NOT NULL,
	joinDate TIMESTAMP NOT NULL,
    modifyDate TIMESTAMP NOT NULL,

    FOREIGN KEY (contactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'Products' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Products (
    productID INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DEC(7, 2) NOT NULL,
    quantity INT UNSIGNED NOT NULL,
    category ENUM('Rulebook', 'Miniature', 'Dice', 'Game Aid', 'Digital Content', 'Merchandise', 'Custom Content'),
    status ENUM('Available', 'Out of Stock') NOT NULL,
    publisherID INT,

    FOREIGN KEY (publisherID) REFERENCES Publishers(publisherID)
);

-- Create the 'ProductImages' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ProductImages (
    productImageID INT AUTO_INCREMENT PRIMARY KEY,
    productID INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    source BLOB NOT NULL,

    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Create the 'Stock' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Stock (
	location VARCHAR(50) PRIMARY KEY,	-- // Location Identification System: use a series of numbers to pinpoint the storage location of a specific product in the stock.
										-- [zone]-[rack]-[shelf]-[pallet] — e.g. 2-004-12-55 -> zone= 2, rack= 004, shelf= 12, pallet= 55
    productID INT,
    maxCapacity INT NOT NULL,	-- per pallet
    
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Create the 'ProductEntry' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ProductMovement (
    productID INT,
    location VARCHAR(50) NOT NULL,
    movementType ENUM('IN', 'OUT') NOT NULL,
    quantityMoved INT NOT NULL,
    reason TEXT,
	movedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (productID) REFERENCES Products(productID),
    FOREIGN KEY (location) REFERENCES Stock(location)
);

CREATE INDEX idx_movement ON ProductMovement (productID, location, movedAt);

-- Create the 'Orders' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Orders (
    orderID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    totalPrice FLOAT(8) NOT NULL,
    orderStatus ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunding', 'Refunded'),
    shippingAddressID INT,
    purchaseDate TIMESTAMP,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (shippingAddressID) REFERENCES Address(addressID)
);

-- Create the 'ItemOrder' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ItemOrder (
    itemOrderID INT AUTO_INCREMENT PRIMARY KEY,
    orderID INT,
    productID INT,
    totalPrice FLOAT(8) NOT NULL,
    quantity INT UNSIGNED NOT NULL,

    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Create the 'PaymentOption' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE PaymentOption (
    paymentOptionID INT AUTO_INCREMENT PRIMARY KEY,
    method ENUM('Credit/Debit', 'E-Wallet', 'Banking', 'Cash') NOT NULL,
    paymentWebLink TEXT,
    description TEXT,
    icon TEXT
);

-- Create the 'ContactInfo' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE ContactInfo (
    contactInfoID INT AUTO_INCREMENT PRIMARY KEY,
    description TEXT,
    defaultEmailAddress INT,
    defaultPhoneNumber INT,
    defaultAddressID INT,
    facebook VARCHAR(100),
    instagram VARCHAR(100),
    x VARCHAR(100),
    linkedin VARCHAR(100),
	
    FOREIGN KEY (defaultEmailAddress) REFERENCES EmailAddress(email),
    FOREIGN KEY (defaultPhoneNumber) REFERENCES PhoneNumber(phoneNumber),
    FOREIGN KEY (defaultAddressID) REFERENCES Address(addressID)
);

-- Create the 'Couriers' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Couriers (
    courierID INT AUTO_INCREMENT PRIMARY KEY,
    courierName VARCHAR(100) NOT NULL,
    api_key VARCHAR(100) NOT NULL
);

-- Create the 'Reviews' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Reviews (
    userID INT,
    productID INT,
    comment TEXT,
    score INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (productID) REFERENCES Products(productID)
);

-- Create the 'EmailAddress' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE EmailAddress (
    contactInfoID INT,
    email VARCHAR(20) PRIMARY KEY,
    isVerified BOOLEAN DEFAULT False,

    FOREIGN KEY (contactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'PhoneNumber' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE PhoneNumber (
    contactInfoID INT,
    phoneNumber VARCHAR(20) PRIMARY KEY,

    FOREIGN KEY (contactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'Address' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Address (
    addressID INT AUTO_INCREMENT PRIMARY KEY,
    contactInfoID INT NOT NULL,
    addressLine1 TEXT NOT NULL,
    addressLine2 TEXT,	-- subDistrict + district + vice versa
    city VARCHAR(50),	-- city + province
	country VARCHAR(20) DEFAULT 'Thailand',
    postalCode VARCHAR(10),
    
    FOREIGN KEY (contactInfoID) REFERENCES ContactInfo(contactInfoID)
);

-- Create the 'Shipping' table (Datatype sizes and nullability of all variables are subject to change)
CREATE TABLE Shipping (
    parcelNumber VARCHAR(100) PRIMARY KEY,
    orderID INT,
    actualDeliveryDate TIMESTAMP,
    courierID INT,
    sourceAddressID INT,
    destinationAddressID INT, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (orderID) REFERENCES Orders(orderID),
    FOREIGN KEY (courierID) REFERENCES Couriers(courierID),
    FOREIGN KEY (sourceAddressID, destinationAddressID) REFERENCES Address(addressID)
);
