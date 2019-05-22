CREATE DATABASE GATUNO;

-- banco de dados = nome, email, data de nascimento, senha(hash)
-- e se tá validado

CREATE TABLE tb_User(
    cd_user INT PRIMARY KEY NOT NULL,
    nm_user VARCHAR(60),
    ds_email VARCHAR(100),
    dt_nasc DATE,
    ds_password VARCHAR(20),
    is_verified BOOLEAN
);