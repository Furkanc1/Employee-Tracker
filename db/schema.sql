DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE employees (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  employees_name VARCHAR(100) NOT NULL,
  role_id INT NOT NULL
);

CREATE TABLE employees_roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    employees_role TEXT NOT NULL,
    income INT NOT NULL,
    department_id INT NOT NULL
);

CREATE TABLE departments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_id INT NOT NULL,
  departments_name VARCHAR(100) NOT NULL
);

SELECT DATABASE();