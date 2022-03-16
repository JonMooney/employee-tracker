const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  console.log(`Connected to the employee_tracker_db database.`)
);

let finished = false;

const main = async () => {
    // Main loop until user selects 'Exit Application'
    while(!finished){
        clearConsole();

                
        const {choice} = await promptMain();

        if(choice === 'Exit Application'){
            finished = true;
        }else if(choice === 'View all Departments'){
            viewDepartments();
        }else if(choice === 'View all Roles'){
            viewRoles();
        }else if(choice === 'View all Employees'){
            viewEmployees();
        }else if(choice === 'Add a Department'){
            //await promptEngineer();
        }
        else if(choice === 'Add a Role'){
            //await promptEngineer();
        }
        else if(choice === 'Add an Employee'){
            //await promptEngineer();
        }
        else if(choice === 'Update an Employee Role'){
            //await promptEngineer();
        }
    }

    console.log ('Bye!');
    process.exit()
}

// Main questions for loop
const promptMain = async () => {
    return inquirer.prompt([
     {
         type: 'list',
         name: 'choice',
         message: '\nWhat would you like to do?\n',
         choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit Application'],
     }
     ])
}

function viewDepartments(){
    db.query(`SELECT department.id AS 'ID', department.d_name AS 'Dept. Name' FROM department`, (err, result) => {
        if (err) {
            console.log(err);
        }

        clearConsole();

        console.log('\n[Departments]\n');
        console.table(result);
        console.log('(Press up or down to show the main menu)');
    });
}

function viewRoles(){
    db.query(`SELECT roles.id AS 'ID', roles.title AS 'Title', CONCAT('$', FORMAT(roles.salary, 0)) AS 'Salary', roles.department_id AS 'Dept. ID', department.d_name AS 'Dept. Name' from roles JOIN department ON roles.department_id = department.id`, (err, result) => {
        if (err) {
            console.log(err);
        }

        clearConsole();

        console.log('\n[Roles]\n');
        console.table(result);
        console.log('(Press up or down to show the main menu)');
    });
}

function viewEmployees(){
    const sql = `select e.id ID, 
    CONCAT(e.first_name, ' ', e.last_name) Name, 
    roles.title Role, 
    CONCAT(m.first_name, ' ', m.last_name) Manager 
    FROM 
    employee e 
    JOIN 
    roles ON e.role_id = roles.id
    LEFT JOIN
    employee m ON m.id = e.manager_id` ;

    // const sql = `select employee.id AS 'ID', CONCAT(employee.first_name, ' ', employee.last_name) AS 'Name', roles.title AS 'Role' from employee JOIN roles ON employee.role_id = roles.id`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }

        clearConsole();

        console.log('\n[Employees]\n');
        console.table(result);
        console.log('(Press up or down to show the main menu)');
    });
}

function clearConsole() {
    console.clear();
    //process.stdout.write('\033c'); // Clears screen, not prompt
    //process.stdout.write('\033[2J'); // Clears screen, including prompt
}

main();


// Standard query
// db.query(`SELECT * FROM roles`, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
// });

// Prepared statement example with variable
// db.query(`DELETE FROM books WHERE id = ?`, deletedRow, (err, result) => {
//     if (err) {
//       console.log(err);
//     }
//     console.log(result);
//   });