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
            await addDept();
            console.log('\nDepartment Added!')
            pause(1500);
        }
        else if(choice === 'Add a Role'){
            await addRole();
            console.log('\nRole Added!')
            pause(1500);
        }
        else if(choice === 'Add an Employee'){
            await addEmployee();
            console.log('\nEmployee Added!')
            pause(1500);
        }
        else if(choice === 'Update Employee Role'){
            await roleUpdate();
            console.log('\nEmployee Role Updated!')
            pause(1500);
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
         choices: ['View all Departments', 'View all Roles', 'View all Employees', 'Add a Department', 'Add a Role', 'Add an Employee', 'Update Employee Role', 'Exit Application'],
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
    const sql = `SELECT roles.id AS 'ID', 
    roles.title AS 'Title', 
    department.d_name AS 'Dept. Name', 
    CONCAT('$', FORMAT(roles.salary, 0)) AS 'Salary' 
    FROM roles 
    JOIN department ON roles.department_id = department.id
    ORDER BY roles.title`;

    db.query(sql, (err, result) => {
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
    department.d_name AS 'Dept.',  
    CONCAT('$', FORMAT(roles.salary, 0)) Salary, 
    CONCAT(m.first_name, ' ', m.last_name) Manager 
    FROM employee e 
    LEFT JOIN roles ON e.role_id = roles.id 
    LEFT JOIN department ON department.id = roles.department_id 
    LEFT JOIN employee m ON m.id = e.manager_id`;

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

const addDept = async () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: '\nWhat is the name of the department?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(' Please enter the department name!');
                    return false;
                }
            }
        }
    ]).then(data => {
        db.query(`INSERT INTO department (d_name) VALUES ('${data.name}')`, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

const addRole = async () => {
    let ids = []
    let names = []
   
    db.query(`SELECT * FROM department`, (err, result) => {
        if (err) {
            console.log(err);
        }
        
        result.forEach(obj => {
            ids.push(obj.id)
            names.push(obj.d_name)  
          })

    });

    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: '\nWhat is the name of the role?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(' Please enter the role name!');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: '\nWhat is the salary of the role?',
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(' Please enter the salary of the role!');
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'choice',
            message: '\nWhich department does the role belong to?\n',
            choices: names
        }
    ]).then(data => {
        let dep_id;
        for(let a=0;a<names.length;a++){
            if(names[a] === data.choice){
                dep_id = ids[a];
                break;
            }
        }

        db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${data.name}', ${parseInt(data.salary)}, ${parseInt(dep_id)})`, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

const addEmployee = async () => {
    let role_ids = [];
    let roles = [];
    let manager_ids = [];
    let managers = [];
   
    db.query(`SELECT * FROM roles`, (err, result) => {
        if (err) {
            console.log(err);
        }
        
        result.forEach(obj => {
            role_ids.push(obj.id);
            roles.push(obj.title);
        })
    });

    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
            console.log(err);
        }
        
        result.forEach(obj => {
            if(obj.manager_id === null){
                manager_ids.push(obj.id);
                managers.push(obj.first_name + ' ' + obj.last_name);
            }
        })
    });

    return inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: `\nWhat is the employee's first name?`,
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(` Please enter the employee's first  name!`);
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'last',
            message: `\nWhat is the employee's last name?`,
            validate: input => {
                if (input) {
                    return true;
                } else {
                    console.log(` Please enter the employee's last name!`);
                    return false;
                }
            }
        },
        {
            type: 'list',
            name: 'role',
            message: `\nWhat is the employee's role?\n`,
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: `\nWho is the employee's manager?\n`,
            choices: managers
        }
    ]).then(data => {
        let role_id;
        for(let a=0;a<roles.length;a++){
            if(roles[a] === data.role){
                role_id = role_ids[a];
                break;
            }
        }

        let manager_id;
        for(let a=0;a<managers.length;a++){
            if(managers[a] === data.manager){
                manager_id = manager_ids[a];
                break;
            }
        }

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first}', '${data.last}', ${parseInt(role_id)}, ${parseInt(manager_id)})`, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}

const roleUpdate = async () => {
    let role_ids = [];
    let roles = [];
    let employee_ids = [];
    let employees = [];
   
    db.query(`SELECT * FROM roles`, (err, result) => {
        if (err) {
            console.log(err);
        }
        
        result.forEach(obj => {
            role_ids.push(obj.id);
            roles.push(obj.title);
        })
    });

    db.query(`SELECT * FROM employee`, (err, result) => {
        if (err) {
            console.log(err);
        }
        
        result.forEach(obj => {
            employee_ids.push(obj.id);
            employees.push(obj.first_name + ' ' + obj_last_name);
        })
    });

    return inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: `\nWhich employee's role would you like to update?\n`,
            choices: employees
        },
        {
            type: 'list',
            name: 'employee',
            message: `\nWhat role should this employee belong to?\n`,
            choices: roles
        }
    ]).then(data => {
        let role_id;
        for(let a=0;a<roles.length;a++){
            if(roles[a] === data.role){
                role_id = role_ids[a];
                break;
            }
        }

        let manager_id;
        for(let a=0;a<managers.length;a++){
            if(managers[a] === data.manager){
                manager_id = manager_ids[a];
                break;
            }
        }

        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${data.first}', '${data.last}', ${parseInt(role_id)}, ${parseInt(manager_id)})`, (err, result) => {
            if (err) {
                console.log(err);
            }
        });
    });
}


// Helper Functions
function clearConsole() {
    console.clear();
    //process.stdout.write('\033c'); // Clears screen, not prompt
    //process.stdout.write('\033[2J'); // Clears screen, including prompt
}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}

main();