class Employee {
  constructor(employeeObj) {
    // Role ID: number
    // Job Title: string
    // Department ID: number
    // Department Name: string
    // First Name: string from inquirer prompt
    // Last Name: string from inquirer prompt
    // Salary: number
    // Manager ID (id of one of the employees with role of Manager): number
    // Manager Name: string
    Object.assign(this, employeeObj);
  }
}

module.exports = Employee;