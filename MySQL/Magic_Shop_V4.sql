CREATE TABLE `products` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `description` varchar(255),
  `price` decimal(7,2) NOT NULL,
  `quantity` integer NOT NULL COMMENT 'ProductEntry อัพเดท, quantity += receiveNumber ตาม ปัจจุบัน',
  CONSTRAINT `chk_quantity_positive` CHECK (`quantity` > 0),
  `category` enum('Rulebook','Miniature','Dice','Game Aid','Digital Content','Merchandise','Custom Content','etc...') COMMENT 'can add new category in future',
  `status` enum('Available','Out of Stock'),
  `publisherID` integer
);

CREATE TABLE `warehouse` (
  `location` varchar(255) PRIMARY KEY,
  `productID` integer,
  `capacity` integer
);

CREATE TABLE `productmovement` (
  `productID` INT NOT NULL,
  `warehouseLoc` VARCHAR(255) NOT NULL,
  `movementType` ENUM('IN', 'OUT') NOT NULL COMMENT 'IN = รับเข้า, OUT = ตัดออก',
  `quantity` INT NOT NULL COMMENT 'จำนวนสินค้าที่เคลื่อนไหว ต้องเป็นค่าบวกเสมอ',
  CONSTRAINT `chk_quantity_positive` CHECK (`quantity` > 0),
  `reason` VARCHAR(255) COMMENT 'อธิบายเหตุผล เช่น ขาย, คืน supplier, เสีย, ฯลฯ',
  `movedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productID`, `warehouseLoc`, `movedAt`)
);

CREATE TABLE `productimages` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `productID` integer,
  `name` varchar(255) UNIQUE NOT NULL,
  `description` text,
  `img` blob NOT NULL
);

CREATE TABLE `orderitems` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `orderID` integer,
  `productID` integer,
  `totalPrice` float(8) NOT NULL COMMENT 'as quantity*product_price #ต่อ 1 สินค้า ซื้อหลายชิ้นได้ นับรวมกันเท่าไร',
  CONSTRAINT `chk_totalPrice_positive` CHECK (`totalPrice` > 0),
  `quantity` integer NOT NULL COMMENT 'check quantity > 0',
  CONSTRAINT `chk_quantity_positive` CHECK (`quantity` > 0)
);

CREATE TABLE `order` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `userID` integer,
  `totalPrice` float(8) NOT NULL COMMENT 'as quantity*product_price #ราคารวมทุกอย่าง ใน order มีรวม ship ด้วย',
  CONSTRAINT `chk_totalPrice_positive` CHECK (`totalPrice` > 0),
  `orderStatus` enum('Pending','Processing','Shipped','Delivered','Cancelled','Refunding','Refunded'),
  `shippingAddressID` integer NOT NULL,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `notes` varchar(255)
);

CREATE TABLE `users` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `birthday` date,
  `username` varchar(255) UNIQUE,
  `password` varchar(255) NOT NULL,
  `contactID` integer,
  `accountStatus` enum('Active','Suspended','Deactivated') NOT NULL,
  `profilePicture` blob,
  `role` enum('Customer','Data Entry Admin','Super Admin'),
  `joinDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  `modifyDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  `lastLogin` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `publishers` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `username` varchar(255) UNIQUE NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) UNIQUE NOT NULL,
  `contactID` integer NOT NULL,
  `servicesFee` float(3) DEFAULT 30,
  `description` text,
  `logo_img` blob,
  `publisherWeb` text,
  `joinDate` timestamp DEFAULT CURRENT_TIMESTAMP,
  `modifyDate` timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `contactinfo` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `defaultEmailAddressID` integer,
  `defaultPhoneNumberID` integer,
  `defaultAddressID` integer,
  `x` varchar(255),
  `linkedIn` varchar(255),
  `facebook` varchar(255),
  `instagram` varchar(255),
  `notes` text
);

CREATE TABLE `emailaddress` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255),
  `contactInfoId` integer,
  `isVerified` boolean DEFAULT false
);

CREATE TABLE `phonenumber` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `phoneNumber` varchar(255),
  `contactInfoId` integer
);

CREATE TABLE `address` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `contactInfoId` integer,
  `addressLine1` varchar(255) NOT NULL,
  `addressLine2` varchar(255),
  `city` varchar(255),
  `country` varchar(255) DEFAULT 'Thailand',
  `postalCode` varchar(255)
);

CREATE TABLE `reviews` (
  `productID` integer,
  `userID` integer,
  `comment` text,
  `score` integer(1),
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productID`, `userID`)
);

CREATE TABLE `couriers` (
  `id` integer AUTO_INCREMENT PRIMARY KEY,
  `name` varchar(255) NOT NULL,
  `api_key` varchar(255) NOT NULL
);

CREATE TABLE `shipping` (
  `parcel_number` varchar(255) PRIMARY KEY,
  `orderID` integer,
  `actualDeliveryDate` timestamp,
  `sourceAddressID` integer,
  `destinationAddressID` integer,
  `courierID` integer,
  `createdAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE `products` ADD FOREIGN KEY (`publisherID`) REFERENCES `publishers` (`id`);

ALTER TABLE `warehouse` ADD FOREIGN KEY (`productID`) REFERENCES `products` (`id`);

ALTER TABLE `productmovement` ADD FOREIGN KEY (`productID`) REFERENCES `products` (`id`);

ALTER TABLE `productmovement` ADD FOREIGN KEY (`warehouseLoc`) REFERENCES `warehouse` (`location`);

ALTER TABLE `productimages` ADD FOREIGN KEY (`productID`) REFERENCES `products` (`id`);

ALTER TABLE `orderitems` ADD FOREIGN KEY (`orderID`) REFERENCES `order` (`id`);

ALTER TABLE `orderitems` ADD FOREIGN KEY (`productID`) REFERENCES `products` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

ALTER TABLE `order` ADD FOREIGN KEY (`shippingAddressID`) REFERENCES `address` (`id`);

ALTER TABLE `users` ADD FOREIGN KEY (`contactID`) REFERENCES `contactinfo` (`id`);

ALTER TABLE `publishers` ADD FOREIGN KEY (`contactID`) REFERENCES `contactinfo` (`id`);

ALTER TABLE `contactinfo` ADD FOREIGN KEY (`defaultEmailAddressID`) REFERENCES `emailaddress` (`id`);

ALTER TABLE `contactinfo` ADD FOREIGN KEY (`defaultPhoneNumberID`) REFERENCES `phonenumber` (`id`);

ALTER TABLE `contactinfo` ADD FOREIGN KEY (`defaultAddressID`) REFERENCES `address` (`id`);

ALTER TABLE `emailaddress` ADD FOREIGN KEY (`contactInfoId`) REFERENCES `contactinfo` (`id`);

ALTER TABLE `phonenumber` ADD FOREIGN KEY (`contactInfoId`) REFERENCES `contactinfo` (`id`);

ALTER TABLE `address` ADD FOREIGN KEY (`contactInfoId`) REFERENCES `contactinfo` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`productID`) REFERENCES `products` (`id`);

ALTER TABLE `reviews` ADD FOREIGN KEY (`userID`) REFERENCES `users` (`id`);

ALTER TABLE `shipping` ADD FOREIGN KEY (`orderID`) REFERENCES `order` (`id`);

ALTER TABLE `shipping` ADD FOREIGN KEY (`sourceAddressID`) REFERENCES `address` (`id`);

ALTER TABLE `shipping` ADD FOREIGN KEY (`destinationAddressID`) REFERENCES `address` (`id`);

ALTER TABLE `shipping` ADD FOREIGN KEY (`courierID`) REFERENCES `couriers` (`id`);


DELIMITER //

-- 1. Trigger สำหรับอัปเดต quantity ใน Products จาก ProductMovement
CREATE TRIGGER trg_product_movement_after_insert
AFTER INSERT ON productmovement
FOR EACH ROW
BEGIN
  IF NEW.movementType = 'IN' THEN
    UPDATE products
    SET quantity = quantity + NEW.quantity
    WHERE id = NEW.productID;
  ELSE
    UPDATE products
    SET quantity = quantity - NEW.quantity
    WHERE id = NEW.productID;
  END IF;
END;
//

-- 2. Trigger สำหรับคำนวณ totalPrice ของ OrderItems จากราคาสินค้า
CREATE TRIGGER trg_order_items_before_insert
BEFORE INSERT ON orderitems
FOR EACH ROW
BEGIN
  DECLARE unit_price DECIMAL(7,2);
  SELECT price INTO unit_price FROM products WHERE id = NEW.productID;
  SET NEW.totalPrice = unit_price * NEW.quantity;
END;
//

-- 3. Trigger สำหรับอัปเดตราคารวมของ Order จาก OrderItems
CREATE TRIGGER trg_order_items_after_insert
AFTER INSERT ON orderitems
FOR EACH ROW
BEGIN
  UPDATE `Order`
  SET totalPrice = (
    SELECT SUM(totalPrice)
    FROM orderitems
    WHERE orderID = NEW.orderID
  )
  WHERE id = NEW.orderID;
END;
//

DELIMITER ;

