class Role {
  constructor(roleObj) {
    // Job Title: string
    // Role ID: number
    // Department ID: number
    // Salary: number
    Object.assign(this, roleObj);
  }
}

module.exports = Role;