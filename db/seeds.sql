INSERT INTO employees (employees_name, role_id)
VALUES ("Roy Harper", 3),
       ("Johnson Jones", 1),
       ("Mike Coxs", 4),
       ("McNugget Man", 5),
       ("Johnson and Johnson", 1);
       

INSERT INTO employees_roles (employees_role, income, department_id)
VALUES ("Manager", 10000, 2),
       ("Assistant Manager", 45000, 2),
       ("Sales Associate", 38000, 3),
       ("Full Time Lead", 80000, 5),
       ("Doesnt Work Here", 100, 1),
       ("Assistant Lead", 39000, 2),
       ("Goat", 100000, 1);

INSERT INTO departments (department_id, departments_name)
VALUES (1, "Legal"),
       (2, "Operations"),
       (3, "Production"),
       (4, "Risk Management"),
       (5, "Engineering");
 