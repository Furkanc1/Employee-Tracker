SELECT employees.employees_name AS employees, employees_review.review
FROM employees_review
LEFT JOIN employees
ON employees_review.employees_id = employees.id
ORDER BY employees.employees_name;
