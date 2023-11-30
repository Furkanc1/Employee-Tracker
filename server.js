const express = require(`express`);
const mySQL2 = require(`mysql2`);
const inquirer = require(`inquirer`);
const Department = require("./db/models/Department");
const Role = require("./db/models/Role");
const Employee = require("./db/models/Employee");

const PORT = process.env.PORT || 3002;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

capWords = (str) => {
  return str.replace(/\b\w/g, (match) => {
    return match.toUpperCase();
  });
}

const roleLevels = {
  Manager: 1,
  Assistant_Manager: 2,
  Sales_Associate: 3,
  Full_Time_Lead: 4,
  Doesnt_Work_Here: 5,
  Assistant_Lead: 6,
  Goat: 7
}

// Connect to database
const db = mySQL2.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "RavenRaven123",
    database: "employees_db",
    multipleStatements: true,
    // rowsAsArray: true
  }, (database) => {
    console.log(`Connected to the employees_db database`, database);
    // progomatically run the schema.sql then seeds.sql (if the employees_DB doesnt exist)
  }
);

const viewEmployees = ( res = false, server = false, newestFirst = false ) => {
  const sql = `SELECT * FROM roles; SELECT * FROM employees; SELECT * FROM departments;`;

  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, employees, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    let expandedEmployees = employees.map(emp => {
      let isManager = emp.role_id == roleLevels.Manager;
      let managerOfEmployee = employees.find(em => emp.manager_id == em.id);
      let thisEmployeesRole = expandedRoles.find(rol => rol.id == emp.role_id);
      let thisEmployeesDepartment = departments.find(dep => dep.id == thisEmployeesRole.department_id);

      return {
        ...new Employee(emp),
        salary: thisEmployeesRole.salary,
        job_title: thisEmployeesRole.title,
        department_id: thisEmployeesDepartment.id,
        department_name: thisEmployeesDepartment.name,
        manager_id: isManager ? null : managerOfEmployee.id,
        manager_name: isManager ? null : `${managerOfEmployee.first_name} ${managerOfEmployee.last_name}`,
      }
    })

    if (newestFirst == true) {
      expandedEmployees = expandedEmployees.reverse();
      // expandedEmployees = expandedEmployees.sort((firstEmployee, secondEmployee) => secondEmployee.id - firstEmployee.id);
    };

    if (error) {
      if (server == true) {
        res.status(500).json({ error: error.message });
      } else {
        console.log(`error getting employees`, error);
      }
      return;
    }
  
    if (server == true) {
      res.json({
        message: "success",
        data: expandedEmployees,
      });
    } else {
      if (expandedEmployees.length > 0) {
        console.table(expandedEmployees);
      } else {
        console.log(`There are no Employees in the Database Currently`);
      }
      setTimeout(() => {
        startMenu();
      }, 3500)
    }
  });
}

const viewDepartments = ( res = false, server = false ) => {
  const sql = `SELECT * FROM departments`;
  db.query(sql, (error, departments) => {
    if (error) {
      if (server == true) {
        res.status(500).json({ error: error.message });
      } else {
        console.log(`error getting departments`, error);
      }
      return;
    }
  
    if (server == true) {
      res.json({
        message: "success",
        data: departments,
      });
    } else {
      if (departments.length > 0) {
        let databaseDepartments = departments.map(dep => new Department(dep));
        console.table(databaseDepartments);
      } else {
        console.log(`There are no Departments in the Database Currently`);
      }
      setTimeout(() => {
        startMenu();
      }, 3500)
    }
  });
}

const viewRoles = async ( res = false, server = false ) => {
  const sql = `SELECT * FROM roles; SELECT * FROM departments;`;

  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    if (error) {
      if (server == true) {
        res.status(500).json({ error: error.message });
      } else {
        console.log(`error getting roles`, error);
      }
      return;
    }
  
    if (server == true) {
      res.json({
        message: "success",
        data: expandedRoles,
      });
    } else {
      if (expandedRoles.length > 0) {
        console.table(expandedRoles);
      } else {
        console.log(`There are no Roles in the Database Currently`);
      }
      setTimeout(() => {
        startMenu();
      }, 3500)
    }
  });
}

const addEmployee = (first_name, last_name, manager_id, role_id, req = false, res = false, server = false) => {
  const sql = `INSERT INTO employees (first_name, last_name, manager_id, role_id) VALUES (?, ?, ?, ?);`;
  if (server == true) {
    let { body } = req;
    const params = [body.first_name, body.last_name, body.manager_id, body.role_id];
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: body,
      });
    });
  } else {
    const params = [capWords(first_name), capWords(last_name), manager_id, role_id];
    db.query(sql, params, (err, addedEmployeeMessage) => {
      if (err) {
       console.log({ error: err.message });
        return;
      }
      console.log(`Successfully Added Employee`);
      let sortByNewestFirst = true;
      viewEmployees(false, false, sortByNewestFirst);
    });
  }
}

const askEmployeeQuestionsAndThenAddEmployee = () => {
  const sql = `SELECT * FROM roles; SELECT * FROM employees; SELECT * FROM departments;`;

  db.query(sql, (error, allDataFromTables) => {
    error ? console.log(error) : true; 

    let [ roles, employees, departments ] = allDataFromTables;

    let expandedRoles = roles.map(rol => {
      let thisRolesDepartment = departments.find(dep => dep.id == rol.department_id);
      return {
        ...new Role(rol),
        department_name: thisRolesDepartment.name
      }
    })

    let expandedEmployees = employees.map(emp => {
      let isManager = emp.role_id == roleLevels.Manager;
      let managerOfEmployee = employees.find(em => emp.manager_id == em.id);
      let thisEmployeesRole = expandedRoles.find(rol => rol.id == emp.role_id);
      let thisEmployeesDepartment = departments.find(dep => dep.id == thisEmployeesRole.department_id);

      return {
        ...new Employee(emp),
        salary: thisEmployeesRole.salary,
        job_title: thisEmployeesRole.title,
        department_id: thisEmployeesDepartment.id,
        department_name: thisEmployeesDepartment.name,
        manager_id: isManager ? null : managerOfEmployee.id,
        manager_name: isManager ? null : `${managerOfEmployee.first_name} ${managerOfEmployee.last_name}`,
      }
    })

    let managers = expandedEmployees.filter(emp => emp.role_id == roleLevels.Manager);
    let managerNames = managers.map(emp => `${emp.first_name} ${emp.last_name}`);

    let choices = expandedRoles.map(rol => rol.title);
    let questionsToAsk = [
      {
        type: `input`,
        name: `first_name`,
        message: `What is the first name of the employee?`,
      },
      {
        type: `input`,
        name: `last_name`,
        message: `What is the last name of the employee?`,
      },
      {
        choices,
        name: `role`,
        type: `list`,
        message: `What is the role of the employee?`,
      },
      {
        type: `list`,
        name: `manager`,
        choices: managerNames,
        message: `Who is the manager of this employee?`,
      }
    ];
  
    inquirer.prompt(questionsToAsk).then(employeeResponse => {
      let { first_name, last_name, role, manager } = employeeResponse;
      let role_id = roles.find(rol => rol.title == role).id;
      let manager_id = managers.find(mang => `${mang.first_name} ${mang.last_name}` == manager).id;
      
      if (expandedEmployees.find(emp => emp.first_name == first_name && emp.last_name == last_name)) {
        console.log(`Employee Exists, Same Name Taken`);
        return;
      } else {
        addEmployee(first_name, last_name, manager_id, role_id);
      }
    })
  });
}

// we need to prompt user with options
const mainMenuQuestions = [
  {
    name: `choice`,
    type: `list`,
    message: `Select your choice.`,
    choices: [
      `View all departments`,
      `View all roles`,
      `View all employees`,
      `Add a department`,
      `Add a role`,
      `Add an employee`,
      `Update an employee role`,
    ]
  }
];

const startMenu = () => {
  inquirer.prompt(mainMenuQuestions).then(userResponse => {
    let choice = userResponse.choice;
    
    if (choice == `View all employees`) {
      viewEmployees();
    } else if (choice == `Add an employee`) {
     askEmployeeQuestionsAndThenAddEmployee();
    } else if (choice == `View all departments`) {
      viewDepartments();
    } else if (choice == `View all roles`) {
      viewRoles();
    } else {
      console.log(`not coded yet`);
    }
  });
};

// Read all departments
app.get("/api/departments", (req, res) => {
  let server = true;
 viewDepartments(res, server);
});

// initialize server or api routes
// when you have a post route you are creating a new resource (expects body)
app.post("/api/new-employees", (req, res) => {
  let server = true;
  addEmployee(false, req, res, server);
});

// Read all employees
app.get("/api/employees", (req, res) => {
  let server = true;
 viewEmployees(res, server);
});

// Read all roles
app.get("/api/roles", (req, res) => {
  let server = true;
 viewRoles(res, server);
});
app.get("/api/employees_roles", (req, res) => {
  let server = true;
 viewRoles(res, server);
});

// Read list of all employee reviews using JOIN
app.get("/api/employees-employees_roles", (req, res) => {
  const sql = `SELECT employees.employees_name AS employees, employees_roles.review FROM employees_roles JOIN employees ON employees_roles.employees_id = employees.id ORDER BY employees.employees_name;`;
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// Delete an employee
app.delete("/api/employees/:id", (req, res) => {
  const sql = `DELETE FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: "employee not found",
      });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows,
        id: req.params.id,
      });
    }
  });
});

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startMenu();