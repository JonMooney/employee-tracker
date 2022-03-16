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
            
        }else if(choice === 'View all Employees'){
            //await promptEngineer();
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
         message: '\n\nWhat would you like to do?\n',
         choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update an Employee Role', 'Exit Application'],
     }
     ])
}

const viewDepartments = () => {
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) {
            console.log(err);
        }

        clearConsole();

        console.log('[Departments]\n');
        console.table(result);
        console.log('(Press up or down to show the menu)');
    });
}

function clearConsole() {
    process.stdout.write("\u001b[3J\u001b[2J\u001b[1J");console.clear();
}

console.reset = function () {
    return process.stdout.write('\033c\033[3J');
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