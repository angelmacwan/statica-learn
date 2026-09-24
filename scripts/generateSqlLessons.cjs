const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../src/content/lessons/sql');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const lessons = [
  {
    fileName: '01-intro-to-sql-and-rdbms.json',
    content: {
      id: 'sql-intro-to-sql-and-rdbms',
      slug: 'intro-to-sql-and-rdbms',
      title: 'Intro to SQL & RDBMS',
      description: 'Understand relational databases, tables, rows, columns, and why SQL is the industry standard query language.',
      pathId: 'sql',
      moduleId: 'sql-fundamentals',
      difficulty: 'intro',
      estimatedMinutes: 6,
      concepts: ['rdbms', 'sql', 'database', 'tables'],
      blocks: [
        {
          type: 'text',
          content: 'A **Relational Database Management System (RDBMS)** stores structured data in tables composed of rows and columns, similar to spreadsheets.\n\n**SQL (Structured Query Language)** is the universal language used to interact with RDBMSs like SQLite, PostgreSQL, MySQL, and SQL Server.'
        },
        {
          type: 'multipleChoice',
          question: 'What does a row in a relational database table represent?',
          options: [
            'A single data record or entry',
            'A category or column header',
            'An entire database schema',
            'A SQL command'
          ],
          correctIndex: 0,
          explanation: 'Rows represent individual data records (e.g., one student), while columns define the attributes (e.g., name, age).'
        },
        {
          type: 'code',
          language: 'sql',
          starterCode: 'SELECT * FROM students;',
          schema_sql: 'CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER);',
          seed_sql: "INSERT INTO students VALUES (1, 'Alice', 14, 9), (2, 'Bob', 15, 10), (3, 'Charlie', 14, 9);"
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Write a SQL query to retrieve all columns from the `students` table.',
          starterCode: '-- Write your query below\n',
          schema_sql: 'CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER);',
          seed_sql: "INSERT INTO students VALUES (1, 'David', 16), (2, 'Emma', 15);",
          answer_sql: 'SELECT * FROM students;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '02-types-of-sql-statements.json',
    content: {
      id: 'sql-types-of-sql-statements',
      slug: 'types-of-sql-statements',
      title: 'Types of SQL Statements',
      description: 'Learn the core categories of SQL statements: DDL, DML, and DQL.',
      pathId: 'sql',
      moduleId: 'sql-fundamentals',
      difficulty: 'intro',
      estimatedMinutes: 7,
      concepts: ['ddl', 'dml', 'dql'],
      blocks: [
        {
          type: 'text',
          content: 'SQL statements are categorized based on their purpose:\n\n- **DQL (Data Query Language)**: `SELECT` — fetches data.\n- **DML (Data Manipulation Language)**: `INSERT`, `UPDATE`, `DELETE` — modifies data records.\n- **DDL (Data Definition Language)**: `CREATE`, `ALTER`, `DROP` — defines database structure.'
        },
        {
          type: 'multipleChoice',
          question: 'Which SQL statement category does SELECT belong to?',
          options: [
            'DQL (Data Query Language)',
            'DDL (Data Definition Language)',
            'TCL (Transaction Control Language)',
            'DCL (Data Control Language)'
          ],
          correctIndex: 0,
          explanation: 'SELECT is used to query data from tables, making it part of Data Query Language (DQL).'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Write a DQL query to select the `name` column from the `users` table.',
          starterCode: '-- Retrieve name column from users table\n',
          schema_sql: 'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT, email TEXT);',
          seed_sql: "INSERT INTO users VALUES (1, 'Alice', 'alice@test.com'), (2, 'Bob', 'bob@test.com');",
          answer_sql: 'SELECT name FROM users;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '03-select-and-select-distinct.json',
    content: {
      id: 'sql-select-and-select-distinct',
      slug: 'select-and-select-distinct',
      title: 'SELECT & SELECT DISTINCT',
      description: 'Master column selection, column aliases with AS, and deduplicating results with SELECT DISTINCT.',
      pathId: 'sql',
      moduleId: 'sql-fundamentals',
      difficulty: 'easy',
      estimatedMinutes: 7,
      concepts: ['select', 'distinct', 'alias'],
      blocks: [
        {
          type: 'text',
          content: 'To pick specific columns, list them after `SELECT`:\n\n```sql\nSELECT name, age FROM students;\n```\n\nUse `AS` to rename a column in output headers:\n\n```sql\nSELECT name AS student_name FROM students;\n```\n\nUse `SELECT DISTINCT` to return only unique values:'
        },
        {
          type: 'code',
          language: 'sql',
          starterCode: 'SELECT DISTINCT city FROM customers;',
          schema_sql: 'CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);',
          seed_sql: "INSERT INTO customers VALUES (1, 'Alice', 'Mumbai'), (2, 'Bob', 'Delhi'), (3, 'Charlie', 'Mumbai');"
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Find all unique `department` values from the `employees` table.',
          starterCode: '-- Select distinct departments\n',
          schema_sql: 'CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT);',
          seed_sql: "INSERT INTO employees VALUES (1, 'Alex', 'HR'), (2, 'Brian', 'Engineering'), (3, 'Chloe', 'HR'), (4, 'Daniel', 'Sales');",
          answer_sql: 'SELECT DISTINCT department FROM employees;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '04-filtering-with-where.json',
    content: {
      id: 'sql-filtering-with-where',
      slug: 'filtering-with-where',
      title: 'Filtering with WHERE Clause',
      description: 'Filter table rows using WHERE and comparison operators (=, !=, <, >, <=, >=).',
      pathId: 'sql',
      moduleId: 'sql-filtering-and-sorting',
      difficulty: 'easy',
      estimatedMinutes: 8,
      concepts: ['where', 'operators', 'comparison'],
      blocks: [
        {
          type: 'text',
          content: 'The `WHERE` clause filters rows before returning results:\n\n```sql\nSELECT * FROM products WHERE price > 50;\n```\n\nComparison operators include: `=`, `!=` or `<>`, `<`, `>`, `<=`, `>=`.'
        },
        {
          type: 'multipleChoice',
          question: 'Which comparison operator checks if two values are NOT equal in SQL?',
          options: ['!= or <>', '==', 'NOT=', 'EXCEPT'],
          correctIndex: 0,
          explanation: 'Both != and <> are valid operators in standard SQL for inequality.'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Retrieve `title` and `rating` for all movies with a `rating` greater than or equal to 8.5.',
          starterCode: '-- Select title and rating where rating >= 8.5\n',
          schema_sql: 'CREATE TABLE movies (id INTEGER PRIMARY KEY, title TEXT, rating REAL);',
          seed_sql: "INSERT INTO movies VALUES (1, 'Inception', 8.8), (2, 'Avatar', 7.8), (3, 'Interstellar', 8.6);",
          answer_sql: 'SELECT title, rating FROM movies WHERE rating >= 8.5;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '05-logical-operators.json',
    content: {
      id: 'sql-logical-operators',
      slug: 'logical-operators',
      title: 'Logical Operators: AND, OR, NOT',
      description: 'Combine multiple condition criteria using logical boolean operators.',
      pathId: 'sql',
      moduleId: 'sql-filtering-and-sorting',
      difficulty: 'easy',
      estimatedMinutes: 8,
      concepts: ['and', 'or', 'not', 'boolean-logic'],
      blocks: [
        {
          type: 'text',
          content: 'You can combine conditions using `AND`, `OR`, and `NOT`:\n\n- `AND` requires **both** conditions to be true.\n- `OR` requires **at least one** condition to be true.\n- `NOT` negates a condition.'
        },
        {
          type: 'code',
          language: 'sql',
          starterCode: "SELECT * FROM books WHERE price < 20 AND genre = 'Fiction';",
          schema_sql: 'CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, genre TEXT, price REAL);',
          seed_sql: "INSERT INTO books VALUES (1, 'Book A', 'Fiction', 15.0), (2, 'Book B', 'Fiction', 25.0), (3, 'Book C', 'Tech', 18.0);"
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Find all students who are in `grade` 10 OR have an `age` of 16.',
          starterCode: '-- Select name, age, grade where grade = 10 OR age = 16\n',
          schema_sql: 'CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT, age INTEGER, grade INTEGER);',
          seed_sql: "INSERT INTO students VALUES (1, 'John', 15, 10), (2, 'Jane', 16, 11), (3, 'Sam', 14, 9);",
          answer_sql: 'SELECT name, age, grade FROM students WHERE grade = 10 OR age = 16;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '06-sorting-and-limiting.json',
    content: {
      id: 'sql-sorting-and-limiting',
      slug: 'sorting-and-limiting',
      title: 'Sorting & Limiting Results',
      description: 'Order query results with ORDER BY (ASC, DESC) and limit row counts with LIMIT.',
      pathId: 'sql',
      moduleId: 'sql-filtering-and-sorting',
      difficulty: 'easy',
      estimatedMinutes: 7,
      concepts: ['order-by', 'asc', 'desc', 'limit'],
      blocks: [
        {
          type: 'text',
          content: 'Use `ORDER BY` to sort rows in ascending (`ASC`, default) or descending (`DESC`) order.\nUse `LIMIT` to cap the number of returned rows:\n\n```sql\nSELECT name, salary FROM employees ORDER BY salary DESC LIMIT 3;\n```'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Get the top 2 highest priced products. Return `name` and `price` ordered from highest to lowest.',
          starterCode: '-- Top 2 highest priced products\n',
          schema_sql: 'CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);',
          seed_sql: "INSERT INTO products VALUES (1, 'Laptop', 1200), (2, 'Phone', 800), (3, 'Tablet', 500), (4, 'Monitor', 300);",
          answer_sql: 'SELECT name, price FROM products ORDER BY price DESC LIMIT 2;',
          ordered: true
        }
      ]
    }
  },
  {
    fileName: '07-pattern-matching-and-ranges.json',
    content: {
      id: 'sql-pattern-matching-and-ranges',
      slug: 'pattern-matching-and-ranges',
      title: 'Wildcards, IN, BETWEEN & NULL Checks',
      description: 'Use LIKE with wildcards (% and _), list matching with IN, range checks with BETWEEN, and IS NULL tests.',
      pathId: 'sql',
      moduleId: 'sql-filtering-and-sorting',
      difficulty: 'medium',
      estimatedMinutes: 9,
      concepts: ['like', 'wildcards', 'in', 'between', 'null'],
      blocks: [
        {
          type: 'text',
          content: 'Advanced filtering clauses:\n\n- `LIKE \'A%\'`: matches text starting with "A" (`%` matches any characters, `_` matches single character).\n- `IN (\'NY\', \'CA\')`: matches any value in a list.\n- `BETWEEN 10 AND 50`: matches inclusive ranges.\n- `IS NULL` / `IS NOT NULL`: tests for missing data.'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Find all customers whose `name` starts with "A" and whose `city` is IN ("Mumbai", "Delhi"). Return `name` and `city`.',
          starterCode: '-- Query with LIKE and IN\n',
          schema_sql: 'CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT, city TEXT);',
          seed_sql: "INSERT INTO customers VALUES (1, 'Alice', 'Mumbai'), (2, 'Andrew', 'Delhi'), (3, 'Bob', 'Mumbai'), (4, 'Amanda', 'Chennai');",
          answer_sql: "SELECT name, city FROM customers WHERE name LIKE 'A%' AND city IN ('Mumbai', 'Delhi');",
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '08-aggregate-functions.json',
    content: {
      id: 'sql-aggregate-functions',
      slug: 'aggregate-functions',
      title: 'Aggregate Functions: COUNT, SUM, AVG, MIN, MAX',
      description: 'Perform statistical calculations across multiple table rows.',
      pathId: 'sql',
      moduleId: 'sql-aggregations-and-grouping',
      difficulty: 'easy',
      estimatedMinutes: 8,
      concepts: ['count', 'sum', 'avg', 'min', 'max'],
      blocks: [
        {
          type: 'text',
          content: 'Aggregate functions summarize data into a single value:\n\n- `COUNT(*)` — total number of rows.\n- `SUM(col)` — sum of numeric values.\n- `AVG(col)` — average value.\n- `MIN(col)` / `MAX(col)` — smallest / largest value.'
        },
        {
          type: 'code',
          language: 'sql',
          starterCode: 'SELECT COUNT(*) AS total_sales, AVG(amount) AS avg_sale FROM sales;',
          schema_sql: 'CREATE TABLE sales (id INTEGER PRIMARY KEY, amount REAL);',
          seed_sql: 'INSERT INTO sales VALUES (1, 100), (2, 200), (3, 300);'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Calculate the total (`SUM`) and average (`AVG`) salary of all employees. Return `total_salary` and `avg_salary`.',
          starterCode: '-- Calculate total_salary and avg_salary\n',
          schema_sql: 'CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL);',
          seed_sql: 'INSERT INTO employees VALUES (1, "Alice", 60000), (2, "Bob", 80000), (3, "Charlie", 70000);',
          answer_sql: 'SELECT SUM(salary) AS total_salary, AVG(salary) AS avg_salary FROM employees;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '09-group-by-and-having.json',
    content: {
      id: 'sql-group-by-and-having',
      slug: 'group-by-and-having',
      title: 'Grouping Data: GROUP BY & HAVING',
      description: 'Group rows into categories with GROUP BY and filter aggregated groups with HAVING.',
      pathId: 'sql',
      moduleId: 'sql-aggregations-and-grouping',
      difficulty: 'medium',
      estimatedMinutes: 10,
      concepts: ['group-by', 'having', 'aggregates'],
      blocks: [
        {
          type: 'text',
          content: '`GROUP BY` collapses rows with identical values into summary rows.\n`HAVING` filters groups after aggregation (unlike `WHERE`, which filters individual rows before aggregation):\n\n```sql\nSELECT department, COUNT(*) AS emp_count\nFROM employees\nGROUP BY department\nHAVING COUNT(*) >= 2;\n```'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Find each `department` and its average salary (`avg_salary`) for departments with an average salary greater than 50000.',
          starterCode: '-- Group by department and filter with HAVING\n',
          schema_sql: 'CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, department TEXT, salary REAL);',
          seed_sql: "INSERT INTO employees VALUES (1, 'A', 'HR', 40000), (2, 'B', 'HR', 45000), (3, 'C', 'Tech', 90000), (4, 'D', 'Tech', 80000);",
          answer_sql: 'SELECT department, AVG(salary) AS avg_salary FROM employees GROUP BY department HAVING AVG(salary) > 50000;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '10-conditional-logic-case.json',
    content: {
      id: 'sql-conditional-logic-case',
      slug: 'conditional-logic-case',
      title: 'Conditional Logic with CASE',
      description: 'Add if-then-else logic directly inside SQL query select expressions using CASE WHEN.',
      pathId: 'sql',
      moduleId: 'sql-aggregations-and-grouping',
      difficulty: 'medium',
      estimatedMinutes: 8,
      concepts: ['case', 'when', 'then', 'else'],
      blocks: [
        {
          type: 'text',
          content: 'The `CASE` statement creates conditional column values:\n\n```sql\nSELECT name, score,\n  CASE\n    WHEN score >= 90 THEN \'Pass\'\n    ELSE \'Fail\'\n  END AS status\nFROM tests;\n```'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Query all products: return `name`, `price`, and a new column `price_category` where price >= 100 is "Expensive", else "Affordable".',
          starterCode: '-- Use CASE expression\n',
          schema_sql: 'CREATE TABLE products (id INTEGER PRIMARY KEY, name TEXT, price REAL);',
          seed_sql: "INSERT INTO products VALUES (1, 'Laptop', 999), (2, 'Mouse', 25), (3, 'Headphones', 150);",
          answer_sql: "SELECT name, price, CASE WHEN price >= 100 THEN 'Expensive' ELSE 'Affordable' END AS price_category FROM products;",
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '11-joining-tables-inner-join.json',
    content: {
      id: 'sql-joining-tables-inner-join',
      slug: 'joining-tables-inner-join',
      title: 'Joining Tables: INNER JOIN',
      description: 'Combine columns from two tables based on a related foreign key column.',
      pathId: 'sql',
      moduleId: 'sql-table-joins',
      difficulty: 'medium',
      estimatedMinutes: 10,
      concepts: ['inner-join', 'table-aliases', 'foreign-key'],
      blocks: [
        {
          type: 'text',
          content: 'Relational databases store data across separate tables. `INNER JOIN` matches rows where the join condition is met in both tables:\n\n```sql\nSELECT orders.id, customers.name\nFROM orders\nJOIN customers ON orders.customer_id = customers.id;\n```'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Join `students` and `enrollments` to get `students.name` and `enrollments.course_name` for all enrolled students.',
          starterCode: '-- Join students and enrollments\n',
          schema_sql: 'CREATE TABLE students (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE enrollments (student_id INTEGER, course_name TEXT);',
          seed_sql: "INSERT INTO students VALUES (1, 'Alice'), (2, 'Bob'); INSERT INTO enrollments VALUES (1, 'Math'), (1, 'Science'), (2, 'History');",
          answer_sql: 'SELECT s.name, e.course_name FROM students s JOIN enrollments e ON s.id = e.student_id;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '12-joining-tables-outer-joins.json',
    content: {
      id: 'sql-joining-tables-outer-joins',
      slug: 'joining-tables-outer-joins',
      title: 'Outer Joins: LEFT JOIN & Unmatched Records',
      description: 'Use LEFT JOIN to retain all left table rows even when no matching record exists in the joined table.',
      pathId: 'sql',
      moduleId: 'sql-table-joins',
      difficulty: 'medium',
      estimatedMinutes: 10,
      concepts: ['left-join', 'outer-join', 'null-joins'],
      blocks: [
        {
          type: 'text',
          content: '`LEFT JOIN` returns all rows from the left table, and the matched rows from the right table. Unmatched right columns contain `NULL`.\nThis is ideal for finding missing relationships (e.g. customers who placed 0 orders):'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Find all customers who have NOT placed any orders. Return `customers.name`.',
          starterCode: '-- Find customers with no orders using LEFT JOIN\n',
          schema_sql: 'CREATE TABLE customers (id INTEGER PRIMARY KEY, name TEXT); CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER);',
          seed_sql: "INSERT INTO customers VALUES (1, 'Alice'), (2, 'Bob'), (3, 'Charlie'); INSERT INTO orders VALUES (101, 1), (102, 2);",
          answer_sql: 'SELECT c.name FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '13-create-db-and-tables.json',
    content: {
      id: 'sql-create-db-and-tables',
      slug: 'create-db-and-tables',
      title: 'Creating Databases & Tables',
      description: 'Define table schemas with CREATE TABLE, specifying column names and SQL data types.',
      pathId: 'sql',
      moduleId: 'sql-database-and-schema-management',
      difficulty: 'medium',
      estimatedMinutes: 8,
      concepts: ['create-table', 'data-types', 'schema'],
      blocks: [
        {
          type: 'text',
          content: 'Use `CREATE TABLE` to define new table schemas:\n\n```sql\nCREATE TABLE books (\n  id INTEGER PRIMARY KEY,\n  title TEXT,\n  price REAL\n);\n```\nCommon SQLite data types: `INTEGER`, `TEXT`, `REAL` (floats), `BLOB`, `NUMERIC`.'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Create a table named `courses` with columns `id INTEGER PRIMARY KEY`, `title TEXT`, and `credits INTEGER`. Then insert a row (1, "SQL Basics", 3) and select all.',
          starterCode: '-- Create table courses and select all\nCREATE TABLE courses (\n  -- define columns\n);\n',
          schema_sql: '',
          seed_sql: '',
          answer_sql: 'CREATE TABLE courses (id INTEGER PRIMARY KEY, title TEXT, credits INTEGER); INSERT INTO courses VALUES (1, "SQL Basics", 3); SELECT * FROM courses;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '14-insert-update-delete.json',
    content: {
      id: 'sql-insert-update-delete',
      slug: 'insert-update-delete',
      title: 'Data Manipulation: INSERT, UPDATE, DELETE',
      description: 'Modify rows inside tables using DML commands: INSERT INTO, UPDATE, and DELETE FROM.',
      pathId: 'sql',
      moduleId: 'sql-database-and-schema-management',
      difficulty: 'medium',
      estimatedMinutes: 9,
      concepts: ['insert-into', 'update', 'delete-from'],
      blocks: [
        {
          type: 'text',
          content: 'DML commands:\n\n- `INSERT INTO table (cols) VALUES (vals)` — adds new rows.\n- `UPDATE table SET col = val WHERE condition` — updates existing rows.\n- `DELETE FROM table WHERE condition` — deletes matching rows.'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Update the salary of employee named "Alice" to 75000 in the `employees` table, then return all rows.',
          starterCode: '-- Update Alice salary and select all\n',
          schema_sql: 'CREATE TABLE employees (id INTEGER PRIMARY KEY, name TEXT, salary REAL);',
          seed_sql: "INSERT INTO employees VALUES (1, 'Alice', 60000), (2, 'Bob', 50000);",
          answer_sql: "UPDATE employees SET salary = 75000 WHERE name = 'Alice'; SELECT * FROM employees;",
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '15-constraints-pk-fk.json',
    content: {
      id: 'sql-constraints-pk-fk',
      slug: 'constraints-pk-fk',
      title: 'Database Constraints: Primary & Foreign Keys',
      description: 'Enforce data integrity with PRIMARY KEY, FOREIGN KEY, NOT NULL, and UNIQUE constraints.',
      pathId: 'sql',
      moduleId: 'sql-database-and-schema-management',
      difficulty: 'hard',
      estimatedMinutes: 10,
      concepts: ['primary-key', 'foreign-key', 'not-null', 'unique', 'constraints'],
      blocks: [
        {
          type: 'text',
          content: 'Constraints enforce rules at the database level:\n\n- `PRIMARY KEY`: uniquely identifies each row (cannot be NULL).\n- `FOREIGN KEY`: link to a primary key in another table.\n- `NOT NULL`: prevents NULL values.\n- `UNIQUE`: prevents duplicate values.'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Create a table `orders` with `id INTEGER PRIMARY KEY`, `customer_id INTEGER NOT NULL`, and `amount REAL`. Insert order (1, 10, 99.5) and select all.',
          starterCode: '-- Create orders table with NOT NULL constraint\n',
          schema_sql: '',
          seed_sql: '',
          answer_sql: 'CREATE TABLE orders (id INTEGER PRIMARY KEY, customer_id INTEGER NOT NULL, amount REAL); INSERT INTO orders VALUES (1, 10, 99.5); SELECT * FROM orders;',
          ordered: false
        }
      ]
    }
  },
  {
    fileName: '16-modifying-schema-alter-drop.json',
    content: {
      id: 'sql-modifying-schema-alter-drop',
      slug: 'modifying-schema-alter-drop',
      title: 'Schema Modification: ALTER & DROP',
      description: 'Modify existing table structures using ALTER TABLE and remove tables or databases using DROP TABLE.',
      pathId: 'sql',
      moduleId: 'sql-database-and-schema-management',
      difficulty: 'hard',
      estimatedMinutes: 8,
      concepts: ['alter-table', 'drop-table', 'schema-evolution'],
      blocks: [
        {
          type: 'text',
          content: 'To modify table structure after creation:\n\n- `ALTER TABLE table_name ADD COLUMN col_name type;` — adds a new column.\n- `DROP TABLE table_name;` — permanently deletes a table and all its data.'
        },
        {
          type: 'challenge',
          language: 'sql',
          prompt: 'Add a new column `email TEXT` to the `users` table using `ALTER TABLE`, then select all columns from `users`.',
          starterCode: '-- Alter table users to add email column\n',
          schema_sql: 'CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);',
          seed_sql: "INSERT INTO users VALUES (1, 'Alice');",
          answer_sql: 'ALTER TABLE users ADD COLUMN email TEXT; SELECT * FROM users;',
          ordered: false
        }
      ]
    }
  }
];

for (const lesson of lessons) {
  const filePath = path.join(outputDir, lesson.fileName);
  fs.writeFileSync(filePath, JSON.stringify(lesson.content, null, 2));
  console.log(`Wrote ${lesson.fileName}`);
}

console.log('Successfully created all 16 SQL lessons!');
