const express = require(`express`);
const mySQL2 = require(`mysql2`);

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

  app.post("/api/new-employees", ({ body }, res) => {
    const sql = `INSERT INTO employees (employees_name)
      VALUES (?)`;
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
  });
  
  // Read all movies
  app.get("/api/employees", (req, res) => {
    const sql = `SELECT id, employees_name AS title FROM employees`;
  
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
  
  // Read list of all reviews and associated movie name using JOIN
  app.get("/api/employees-employees_review", (req, res) => {
    const sql = `SELECT employees.employees_name AS employees, employees_review.review FROM employees_review JOIN employees ON employees_review.employees_id = employees.id ORDER BY employees.employees_name;`;
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
  
  // Delete a movie
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