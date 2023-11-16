SELECT employees.employees_name AS employees, employees_roles.review
FROM employees_roles
LEFT JOIN employees
ON employees_roles.employees_id = employees.id
ORDER BY employees.employees_name;
