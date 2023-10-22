CREATE TABLE Users (
   UserID INT PRIMARY KEY,
   UserName VARCHAR(255),
   UserEmail VARCHAR(100)
);

CREATE TABLE Vendor (
    UserID INT,
    VendorID INT PRIMARY KEY,
    Type VARCHAR(20), 
    Name VARCHAR(255),
    FirstName VARCHAR(255), 
    MiddleName VARCHAR(255),
    LastName VARCHAR(255),
    Category VARCHAR(20), 
    ContactNumber VARCHAR(20),
    Email VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID) 
);

CREATE TABLE VendorContactPerson (
    UserID INT,
    VendorID INT,
    CPFirstName VARCHAR(255), 
    CPLastName VARCHAR(255), 
    CPEmail VARCHAR(255), 
    CPPhone INT,
    CPJobRole VARCHAR(255),
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Customer (
    UserID INT,
    CustomerID INT PRIMARY KEY,
    Type VARCHAR(20), 
    Name VARCHAR(255),
    FirstName VARCHAR(255),
    MiddleName VARCHAR(255),
    LastName VARCHAR(255),
    Category VARCHAR(20), 
    ContactNumber VARCHAR(20),
    Email VARCHAR(100),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE CustomerContactPerson (
    UserID INT,
    CustomerID INT,
    CPFirstName VARCHAR(255), 
    CPLastName VARCHAR(255), 
    CPEmail VARCHAR(255), 
    CPPhone INT,
    CPJobRole VARCHAR(255),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE VendorBillingAddresses (
    UserID INT,
    VendorID INT,
    AddressID SERIAL PRIMARY KEY,
    Address TEXT,
    State TEXT, 
    City TEXT,
    Country TEXT,
    ZipCode TEXT,
    IsDefault BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);
CREATE TABLE VendorShippingAddresses (
    UserID INT,
    VendorID INT,
    AddressID SERIAL PRIMARY KEY,
    Address TEXT,
    State TEXT, 
    City TEXT,
    Country TEXT,
    ZipCode TEXT,
    IsDefault BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);

CREATE TABLE CustomerBillingAddresses (
    UserID INT,
    VendorID INT,
    AddressID SERIAL PRIMARY KEY,
    Address TEXT,
    State TEXT, 
    City TEXT,
    Country TEXT,
    ZipCode TEXT,
    IsDefault BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);
CREATE TABLE CustomerShippingAddresses (
    UserID INT,
    VendorID INT,
    AddressID SERIAL PRIMARY KEY,
    Address TEXT,
    State TEXT, 
    City TEXT,
    Country TEXT,
    ZipCode TEXT,
    IsDefault BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID)
);

CREATE TABLE Item (
    UserID INT,
    ItemID INT PRIMARY KEY,
    ItemName VARCHAR(255), 
    ItemCode VARCHAR(100),
    PurchasePrice INT, 
    SalesPrice INT, 
    Currency VARCHAR(100),
    Stock INT,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Purchase (
    PurchaseOrderNumber INT PRIMARY KEY,
    PurchaseDescription TEXT, 
    TimeDate TIMESTAMP, 
    TotalBill INT, 
    AmountDues INT,
    CommittedDate TIMESTAMP,
    VendorID INT, 
    ItemID INT, 
    UserID INT,
    FOREIGN KEY (VendorID) REFERENCES Vendor(VendorID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
);

CREATE TABLE Sales (
    SalesOrderNum INT PRIMARY KEY, 
    SalesDescription TEXT, 
    TimeDate TIMESTAMP, 
    TotalBill INT, 
    AmountDues INT,
    CommittedDate TIMESTAMP,
    CustomerID INT, 
    ItemID INT, 
    UserID INT,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID),
    FOREIGN KEY (ItemID) REFERENCES Item(ItemID)
);
