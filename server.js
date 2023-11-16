const express = require(`express`);
const mySQL2 = require(`mysql2`);
const inquirer = require(`inquirer`);

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mySQL2.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "RavenRaven123",
    database: "employees_db",
  },
  console.log(`Connected to the employees_db database.`)
);

const viewEmployees = ( res = false, server = false ) => {
  const sql = `SELECT id, employees_name AS title FROM employees`;
  db.query(sql, (error, employeesRows) => {
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
        data: employeesRows,
      });
    } else {
      console.log(`employees: `, employeesRows);
    }
  });
}

const addEmployee = (employees_name, req = false, res = false, server = false) => {
  const sql = `INSERT INTO employees (employees_name) VALUES (?)`;
  if (server == true) {
    let { body } = req;
    const params = [body.employees_name];
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
    const params = [employees_name];
    db.query(sql, params, (err, addedEmployeeMessage) => {
      if (err) {
       console.log({ error: err.message });
        return;
      }
      console.log(`successfully added employee`, addedEmployeeMessage);
    });
  }
}

const askEmployeeQuestionsAndThenAddEmployee = () => {
  inquirer.prompt(newEmployeeQuestions).then(employeeResponse => {
    let firstName = employeeResponse.firstName;
    let lastName = employeeResponse.lastName;
    let employeeRole = employeeResponse.employeeRole;
    let employeeManager = employeeResponse.employeeManager;
    let employees_name = `${firstName} ${lastName}`;
    addEmployee(employees_name);
  })
}

// we need to prompt user with options
const mainMenu = [
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

const newEmployeeQuestions = [
  {
    name: `firstName`,
    type: `input`,
    message: `What is the first name of the employee?`,
  },
  {
    name: `lastName`,
    type: `input`,
    message: `What is the last name of the employee?`,
  },
  {
    name: `employeeRole`,
    type: `list`,
    message: `What is the role of the employee?`,
    choices: [
      `manager`,
      `associate`,
      `assistant`,
      `lead`,
      `overviewer`,
      `works Here`,
    ]
  },
  {
    name: `employeeManager`,
    type: `list`,
    message: `Who is the manager of this employee?`,
    choices: [
      `manager 1`,
      `manager 2`,
      `manager 3`,
      `manager 4`,
      `manager 5`,
    ]
  }
]

const startMenu = () => {
  inquirer.prompt(mainMenu).then(userResponse => {
    let choice = userResponse.choice;
    
    if (choice == `View all employees`) {
      viewEmployees();
    } else if (choice == `Add an employee`) {
     askEmployeeQuestionsAndThenAddEmployee();
    } else {
      console.log(`havent coded yet`);
    }
  });
};

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