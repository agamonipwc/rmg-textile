use RMGTextile;

CREATE TABLE UserDetails (
	Id int NOT NULL,
	Name varchar(100) null,
	Email varchar(100) null,
	Username varchar(100) null,
	Password varchar(10) null,
	CreatedOn datetime null,
	CreatedBy varchar(100),
	PRIMARY KEY (Id)
);
SELECT * FROM UserDetails;

--Create Alter column commands
ALTER TABLE UserDetails add ConfirmPassword varchar(15) null;

ALTER TABLE UserDetails ALTER COLUMN Password varchar(300) 
ALTER TABLE UserDetails ALTER COLUMN ConfirmPassword varchar(300) 
ALTER TABLE UserDetails ALTER COLUMN CreatedOn varchar(50) 

ALTER TABLE UserDetails DROP COLUMN Id;
ALTER TABLE UserDetails ADD Id INT NOT NULL IDENTITY(1,1);
ALTER TABLE UserDetails ADD CONSTRAINT PK_UserDetails PRIMARY KEY(Id)

DELETE FROM UserDetails


CREATE TABLE Style (
	Id int NOT NULL,
	StyleName varchar(100) null,
	OrderQty int null,
	OrderRcvngDate datetime null,
	ShipmentDate datetime null,
	Item varchar(100) null,
	SewingSAM int null,
	PlannedOperator int null,
	PlannedHelpers int null,
	PlannedCheckers int null,
	PlannedProduction int null,
	Line int null,
	PRIMARY KEY (Id)
);