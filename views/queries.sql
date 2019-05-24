-- Create a new database called 'DatabaseName'
-- Connect to the 'master' database to run this snippet
USE master
GO
-- Create the new database if it does not exist already
IF NOT EXISTS (
    SELECT name
        FROM sys.databases
        WHERE name = N'gatuno'
)
CREATE DATABASE gatuno
GO


-- Create a new table called 'TableName' in schema 'SchemaName'
-- Drop the table if it already exists
IF OBJECT_ID('SchemaName.tb_User', 'U') IS NOT NULL
DROP TABLE SchemaName.tb_User
GO
-- Create the table in the specified schema
CREATE TABLE SchemaName.tb_User
(
    cd_user INT NOT NULL PRIMARY KEY, -- auto_increment
    nm_user VARCHAR(60),
    ds_email VARCHAR(100),
    dt_nasc DATE,
    ds_password VARCHAR(20),
    is_verified BOOLEAN
);
GO