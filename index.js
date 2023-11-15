//index.js
const inquirer = require('inquirer');
const {
  getAllDepartments,
  getAllRoles,
  getAllEmployees,
  addDepartment,
  addRole,
  addEmployee,
  updateEmployeeRole,
  updateEmployeeManager, // Added import
} = require('./db');

async function startApp() {
  while (true) {
    const { choice } = await inquirer.prompt({
      name: 'choice',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update an employee manager', // Added option
        'Exit',
      ],
    });

    switch (choice) {
      case 'View all departments':
        const departments = await getAllDepartments();
        console.table(departments);
        break;

      case 'View all roles':
        const roles = await getAllRoles();
        console.table(roles);
        break;

      case 'View all employees':
        const employees = await getAllEmployees();
        console.table(employees);
        break;

      case 'Add a department':
        const { departmentName } = await inquirer.prompt({
          name: 'departmentName',
          type: 'input',
          message: 'Enter the name of the department:',
        });
        await addDepartment(departmentName);
        console.log('Department added successfully!');
        break;

      case 'Add a role':
        const roleDetails = await inquirer.prompt([
          {
            name: 'title',
            type: 'input',
            message: 'Enter the title of the role:',
          },
          {
            name: 'salary',
            type: 'input',
            message: 'Enter the salary for the role:',
          },
          {
            name: 'departmentId',
            type: 'input',
            message: 'Enter the department ID for the role:',
          },
        ]);
        await addRole(roleDetails.title, roleDetails.salary, roleDetails.departmentId);
        console.log('Role added successfully!');
        break;

      case 'Add an employee':
        const employeeDetails = await inquirer.prompt([
          {
            name: 'firstName',
            type: 'input',
            message: 'Enter the first name of the employee:',
          },
          {
            name: 'lastName',
            type: 'input',
            message: 'Enter the last name of the employee:',
          },
          {
            name: 'roleId',
            type: 'input',
            message: 'Enter the role ID for the employee:',
          },
          {
            name: 'managerId',
            type: 'input',
            message: 'Enter the manager ID for the employee (optional):',
          },
        ]);
        await addEmployee(
          employeeDetails.firstName,
          employeeDetails.lastName,
          employeeDetails.roleId,
          employeeDetails.managerId || null
        );
        console.log('Employee added successfully!');
        break;

      case 'Update an employee role':
        const employeesToUpdate = await getAllEmployees();
        const employeeChoices = employeesToUpdate.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        const { employeeId, roleId } = await inquirer.prompt([
          {
            name: 'employeeId',
            type: 'list',
            message: 'Select an employee to update:',
            choices: employeeChoices,
          },
          {
            name: 'roleId',
            type: 'input',
            message: 'Enter the new role ID for the employee:',
          },
        ]);

        await updateEmployeeRole(employeeId, roleId);
        console.log('Employee role updated successfully!');
        break;

      case 'Update an employee manager':
        const employeesToUpdateManager = await getAllEmployees();
        const managerChoices = employeesToUpdateManager.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        }));

        const { employeeIdManager, managerId } = await inquirer.prompt([
          {
            name: 'employeeIdManager',
            type: 'list',
            message: 'Select an employee to update the manager:',
            choices: managerChoices,
          },
          {
            name: 'managerId',
            type: 'input',
            message: 'Enter the new manager ID for the employee:',
          },
        ]);

        await updateEmployeeManager(employeeIdManager, managerId);
        console.log('Employee manager updated successfully!');
        break;

      case 'Exit':
        console.log('Exiting the application.');
        process.exit();

      default:
        console.log('Invalid choice. Please try again.');
    }
  }
}

startApp();
