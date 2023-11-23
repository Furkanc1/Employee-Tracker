INSERT INTO departments (name)
VALUES ("Legal"),
       ("Operations"),
       ("Production"),
       ("Risk Management"),
       ("Engineering"),
       ("Homeless");

INSERT INTO roles (title, salary, department_id)
VALUES ("Manager", 10000, 2),
       ("Assistant Manager", 45000, 2),
       ("Sales Associate", 38000, 3),
       ("Full Time Lead", 80000, 5),
       ("Doesnt Work Here", 100, 1),
       ("Assistant Lead", 39000, 2),
       ("Goat", 100000, 1);

INSERT INTO employees (first_name, last_name, manager_id, role_id)
VALUES ("Roy", "Harper", 1, 1),
       ("James", "Jones", 1, 2),
       ("Mike", "Coxs", 1, 3),
       ("McNugget", "Man", 1, 4),
       ("Dick", "Grayson", 1, 5),
       ("Bruce", "Man", 1, 6),
       ("Peter", "Griffin", 7, 1),
       ("Scooby", "Shaggy", 7, 2),
       ("Join", "Gayson", 7, 3),
       ("Gray", "Anatomay", 7, 4),
       ("Alex", "Kent", 7, 5),
       ("Johnson" , "Johnson", 7, 6);
 