INSERT INTO employees (employees_name)
VALUES ("Roy Harper"),
       ("Johnson Jones"),
       ("Mike Coxs"),
       ("McNugget Man"),
       ("Johnson and Johnson");
       

INSERT INTO employees_roles (employees_id, employees_roles)
VALUES (1, "Manager"),
       (2, "Assistant Manager"),
       (3, "Sales Associate"),
       (4, "Full Time Lead"),
       (5, "Doesnt Work Here"),
       (6, "Assistant Lead"),
       (7, "Goat");
       
SELECT * FROM employees_db.employees_roles;
