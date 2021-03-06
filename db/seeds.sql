INSERT INTO department(d_name) VALUES
('HR'),
('Information Technology'),
('Accounting'),
('Mailroom');

INSERT INTO roles(title, salary, department_id) VALUES
('Web Developer', 100000, 2),
('Database Admin', 120000, 2),
('IT Manager', 160000, 2),
('Office Admin', 60000, 1),
('Receptionist', 35000, 1),
('Office Manager', 100000, 1),
('Money Manager', 150000, 3),
('Lead Accountant', 180000, 3),
('Mail Sorter', 35000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES 
('Jim', 'Gregory', 3, NULL),
('Bob', 'Vila', 6, NULL),
('Jon', 'Mooney', 1, 1),
('Greg', 'Jones', 2, 2);
