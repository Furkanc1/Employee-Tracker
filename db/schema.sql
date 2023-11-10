DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employees_name VARCHAR(100) NOT NULL
);

CREATE TABLE employees_review (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employees_id INT,
    employees_review TEXT NOT NULL,
    FOREIGN KEY (employees_id)
    REFERENCES employees(id)
    ON DELETE SET NULL
);

SELECT DATABASE();
