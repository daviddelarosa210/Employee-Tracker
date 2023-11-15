// db.js

const mysql = require('mysql2/promise');
const config = require('./config');
const pool = mysql.createPool(config);

module.exports = {
  async getAllDepartments() {
    const [rows] = await pool.execute('SELECT id, name FROM department');
    return rows;
  },

  async getAllRoles() {
    const [rows] = await pool.execute('SELECT id, title, salary, department_id FROM role');
    return rows;
  },

  async getAllEmployees() {
    const [rows] = await pool.execute(
      'SELECT id, first_name, last_name, role_id, manager_id FROM employee'
    );
    return rows;
  },

  async addDepartment(name, id = null) {
    const [result] = await pool.execute('INSERT INTO department (id, name) VALUES (?, ?)', [id, name]);
    return result.insertId;
  },

  async addRole(title, salary, departmentId) {
    const [result] = await pool.execute(
      'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)',
      [title, salary, departmentId]
    );
    return result.insertId;
  },

  async addEmployee(firstName, lastName, roleId, managerId) {
    const [result] = await pool.execute(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
      [firstName, lastName, roleId, managerId]
    );
    return result.insertId;
  },

  async updateEmployeeRole(employeeId, roleId) {
    await pool.execute('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId]);
  },

  async updateEmployeeManager(employeeId, managerId) {
    await pool.execute('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId]);
  },
};
