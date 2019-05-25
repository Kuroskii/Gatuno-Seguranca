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
IF OBJECT_ID('gatuno.tb_User', 'U') IS NOT NULL
DROP TABLE gatuno.tb_User
GO
-- Create the table in the specified schema
CREATE TABLE gatuno.tb_User
(
    ds_email VARCHAR(100) NOT NULL PRIMARY KEY,
    nm_user VARCHAR(60),
    dt_nasc DATE,
    ds_password VARCHAR(513),
    is_verified BOOLEAN
);
GO