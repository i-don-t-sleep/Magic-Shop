CREATE TABLE `Products` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` varchar(255),
  `price` decimal(7,2) NOT NULL,
  `quantity` integer NOT NULL COMMENT 'ProductEntry อัพเดท, quantity += receiveNumber ตาม ปัจจุบัน',
  `category` enum(Rulebook,Miniature,Dice,Game Aid,Digital Content,Merchandise,Custom Content,etc...) COMMENT 'can add new category in future',
  `status` enum(Available,Out of Stock),
  `publisherID` integer
);

CREATE TABLE `Stock` (
  `location` varchar(255) PRIMARY KEY,
  `productID` integer,
  `capacity` integer
);

CREATE TABLE `ProductEntry` (
  `productID` integer,
  `stockID` integer,
  `receiveNumber` integer NOT NULL COMMENT 'สินค้าที่นำเข้า stock',
  `entryAt` timestamp
);

CREATE TABLE `ProductImages` (
  `id` integer PRIMARY KEY,
  `productID` integer,
  `name` varchar(255) UNIQUE NOT NULL,
  `description` varchar(255),
  `img` blob NOT NULL
);

CREATE TABLE `OrderItems` (
  `id` integer PRIMARY KEY,
  `orderID` integer,
  `productID` integer,
  `totalPrice` float(8) NOT NULL COMMENT 'as quantity*product_price #ต่อ 1 สินค้า ซื้อหลายชิ้นได้ นับรวมกันเท่าไร',
  `quantity` integer NOT NULL COMMENT 'quantity > 0'
);

CREATE TABLE `Order` (
  `id` integer PRIMARY KEY,
  `userID` integer,
  `totalPrice` float(8) NOT NULL COMMENT 'as quantity*product_price #ราคารวมทุกอย่าง ใน order มีรวม ship ด้วย',
  `orderStatus` enum(Pending,Processing,Shipped,Delivered,Cancelled,Refunding,Refunded),
  `shippingAddressID` integer,
  `createdAt` timestamp,
  `updatedAt` timestamp,
  `notes` varchar(255)
);

CREATE TABLE `Users` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `birthday` date,
  `username` varchar(255) UNIQUE,
  `password` varchar(255) NOT NULL,
  `contactID` integer NOT NULL,
  `accountStatus` enum(Active,Suspended,Deactivated) NOT NULL,
  `profilePicture` blob COMMENT 'source Profile Picture',
  `role` enum(Customer,Data Entry Admin,Super Admin),
  `joinDate` timestamp NOT NULL COMMENT 'CURRENT_TIMESTAMP',
  `modifyDate` timestamp NOT NULL COMMENT 'CURRENT_TIMESTAMP after แก้ไข',
  `lastLogin` timestamp COMMENT 'CURRENT_TIMESTAMP after log out'
);

CREATE TABLE `Publishers` (
  `id` integer PRIMARY KEY,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) UNIQUE NOT NULL,
  `contactID` integer NOT NULL,
  `servicesFee` float(3) DEFAULT 30,
  `description` varchar(255),
  `logo_img` blob,
  `publisherWeb` text,
  `joinDate` timestamp NOT NULL COMMENT 'CURRENT_TIMESTAMP',
  `modifyDate` timestamp NOT NULL COMMENT 'CURRENT_TIMESTAMP after แก้ไข'
);

CREATE TABLE `ContactInfo` (
  `id` integer PRIMARY KEY,
  `description` varchar(255) COMMENT 'บันทึกเพิ่มเติม',
  `defaultEmailAddressID` integer,
  `defaultPhoneNumberID` integer,
  `defaultAddressID` integer,
  `x` varchar(255),
  `linkedIn` varchar(255),
  `facebook` varchar(255),
  `instagram` varchar(255)
);

CREATE TABLE `EmailAddress` (
  `contactInfoId` integer,
  `email` varchar(255) PRIMARY KEY NOT NULL,
  `isVerified` boolean DEFAULT false
);

CREATE TABLE `PhoneNumber` (
  `contactInfoId` integer,
  `phoneNumber` varchar(255) PRIMARY KEY NOT NULL
);

CREATE TABLE `Address` (
  `contactInfoId` integer,
  `id` integer PRIMARY KEY,
  `addressLine1` varchar(255) NOT NULL,
  `addressLine2` varchar(255),
  `city` varchar(255) COMMENT 'จังหวัด',
  `country` varchar(255) DEFAULT 'Thailand',
  `postalCode` varchar(255)
);

CREATE TABLE `Reviews` (
  `productID` integer,
  `userID` integer,
  `comment` text,
  `score` integer(1),
  `createdAt` timestamp,
  `updatedAt` timestamp
);

CREATE TABLE `Couriers` (
  `id` integer PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `api_key` varchar(255) NOT NULL
);

CREATE TABLE `Shipping` (
  `parcel_number` varchar(255) PRIMARY KEY NOT NULL,
  `orderID` integer,
  `actualDeliveryDate` timestamp,
  `sourceAddressID` integer,
  `destinationAddressID` integer,
  `courierID` integer,
  `createdAt` timestamp,
  `updatedAt` timestamp
);

ALTER TABLE `Products` ADD FOREIGN KEY (`publisherID`) REFERENCES `Publishers` (`id`);

ALTER TABLE `Stock` ADD FOREIGN KEY (`productID`) REFERENCES `Products` (`id`);

ALTER TABLE `ProductEntry` ADD FOREIGN KEY (`productID`) REFERENCES `Products` (`id`);

ALTER TABLE `ProductEntry` ADD FOREIGN KEY (`stockID`) REFERENCES `Stock` (`location`);

ALTER TABLE `ProductImages` ADD FOREIGN KEY (`productID`) REFERENCES `Products` (`id`);

ALTER TABLE `OrderItems` ADD FOREIGN KEY (`orderID`) REFERENCES `Order` (`id`);

ALTER TABLE `OrderItems` ADD FOREIGN KEY (`productID`) REFERENCES `Products` (`id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`userID`) REFERENCES `Users` (`id`);

ALTER TABLE `Order` ADD FOREIGN KEY (`shippingAddressID`) REFERENCES `Address` (`id`);

ALTER TABLE `Users` ADD FOREIGN KEY (`contactID`) REFERENCES `ContactInfo` (`id`);

ALTER TABLE `Publishers` ADD FOREIGN KEY (`contactID`) REFERENCES `ContactInfo` (`id`);

ALTER TABLE `ContactInfo` ADD FOREIGN KEY (`defaultEmailAddressID`) REFERENCES `EmailAddress` (`email`);

ALTER TABLE `ContactInfo` ADD FOREIGN KEY (`defaultPhoneNumberID`) REFERENCES `PhoneNumber` (`phoneNumber`);

ALTER TABLE `ContactInfo` ADD FOREIGN KEY (`defaultAddressID`) REFERENCES `Address` (`id`);

ALTER TABLE `EmailAddress` ADD FOREIGN KEY (`contactInfoId`) REFERENCES `ContactInfo` (`id`);

ALTER TABLE `PhoneNumber` ADD FOREIGN KEY (`contactInfoId`) REFERENCES `ContactInfo` (`id`);

ALTER TABLE `Address` ADD FOREIGN KEY (`contactInfoId`) REFERENCES `ContactInfo` (`id`);

ALTER TABLE `Reviews` ADD FOREIGN KEY (`productID`) REFERENCES `Products` (`id`);

ALTER TABLE `Reviews` ADD FOREIGN KEY (`userID`) REFERENCES `Users` (`id`);

ALTER TABLE `Shipping` ADD FOREIGN KEY (`orderID`) REFERENCES `Order` (`id`);

ALTER TABLE `Shipping` ADD FOREIGN KEY (`sourceAddressID`) REFERENCES `Address` (`id`);

ALTER TABLE `Shipping` ADD FOREIGN KEY (`destinationAddressID`) REFERENCES `Address` (`id`);

ALTER TABLE `Shipping` ADD FOREIGN KEY (`courierID`) REFERENCES `Couriers` (`id`);
