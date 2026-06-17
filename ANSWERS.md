# Statica Learn — SQL Challenge Solutions

This document contains the correct SQL answers for all challenges in the Statica Learn platform.

---

## 🛒 E-commerce Dataset

### ec-001: Customers from Mumbai
**Prompt:** List the names and emails of all customers who are from Mumbai.
```sql
SELECT name, email FROM customers WHERE city = 'Mumbai';
```

### ec-002: Count Orders per Status
**Prompt:** Count how many orders exist for each status. Return status and order_count, sorted by order_count descending.
```sql
SELECT status, COUNT(*) AS order_count FROM orders GROUP BY status ORDER BY order_count DESC;
```

### ec-003: Top 3 Customers by Spend
**Prompt:** Find the top 3 customers by total amount spent. Return customer_name and total_spent (rounded to 2 decimal places), ordered from highest to lowest.
```sql
SELECT c.name AS customer_name, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_spent FROM customers c JOIN orders o ON c.id = o.customer_id JOIN order_items oi ON o.id = oi.order_id GROUP BY c.id, c.name ORDER BY total_spent DESC LIMIT 3;
```

### ec-004: Most Popular Product Category
**Prompt:** Find the most popular product category by total quantity sold. Return category and total_quantity_sold, ordered from highest to lowest.
```sql
SELECT p.category, SUM(oi.quantity) AS total_quantity_sold FROM products p JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category ORDER BY total_quantity_sold DESC;
```

### ec-005: Customers with No Orders
**Prompt:** Find all customers who have never placed an order. Return their name and email.
```sql
SELECT c.name, c.email FROM customers c LEFT JOIN orders o ON c.id = o.customer_id WHERE o.id IS NULL;
```

### ec-006: Average Order Value per City
**Prompt:** Calculate the average order value per city. An order's value is the sum of (quantity × unit_price) across all its items. Return city and avg_order_value rounded to 2 decimal places.
```sql
SELECT c.city, ROUND(AVG(order_totals.total), 2) AS avg_order_value FROM customers c JOIN orders o ON c.id = o.customer_id JOIN (SELECT order_id, SUM(quantity * unit_price) AS total FROM order_items GROUP BY order_id) order_totals ON o.id = order_totals.order_id GROUP BY c.city;
```

### ec-007: Month with Highest Revenue (2023)
**Prompt:** Find the month in 2023 with the highest total revenue. Return month (as YYYY-MM) and total_revenue rounded to 2 decimal places.
```sql
SELECT strftime('%Y-%m', o.order_date) AS month, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS total_revenue FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE strftime('%Y', o.order_date) = '2023' GROUP BY month ORDER BY total_revenue DESC LIMIT 1;
```

### ec-008: Products Bought Together Most Often
**Prompt:** Find the pair of products that appear in the same order most frequently. Return product_a, product_b, and times_bought_together. Only return the top pair (product_a < product_b to avoid duplicates).
```sql
SELECT p1.name AS product_a, p2.name AS product_b, COUNT(*) AS times_bought_together FROM order_items oi1 JOIN order_items oi2 ON oi1.order_id = oi2.order_id AND oi1.product_id < oi2.product_id JOIN products p1 ON oi1.product_id = p1.id JOIN products p2 ON oi2.product_id = p2.id GROUP BY p1.id, p2.id ORDER BY times_bought_together DESC LIMIT 1;
```

---

## 🏢 Company HR Dataset

### hr-001: List All Senior Employees
**Prompt:** List the name and salary of all employees with level 'senior'. Order by salary descending.
```sql
SELECT name, salary FROM employees WHERE level = 'senior' ORDER BY salary DESC;
```

### hr-002: Average Salary per Department
**Prompt:** Find the average salary per department. Return department_name and avg_salary rounded to 2 decimal places.
```sql
SELECT d.name AS department_name, ROUND(AVG(e.salary), 2) AS avg_salary FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name;
```

### hr-003: Employees Above Department Average
**Prompt:** Find all employees who earn more than the average salary of their own department. Return employee name, their salary, and the department name.
```sql
SELECT e.name, e.salary, d.name AS department_name FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.salary > (SELECT AVG(e2.salary) FROM employees e2 WHERE e2.department_id = e.department_id);
```

### hr-004: Each Employee's Manager
**Prompt:** Show each employee's name alongside their manager's name. Only include employees who have a manager (not top-level leads). Return employee_name and manager_name.
```sql
SELECT e.name AS employee_name, m.name AS manager_name FROM employees e JOIN employees m ON e.manager_id = m.id;
```

### hr-005: Departments Over Budget
**Prompt:** Find departments where the total salary bill exceeds the department budget. Return department_name, total_salaries, and budget.
```sql
SELECT d.name AS department_name, SUM(e.salary) AS total_salaries, d.budget FROM departments d JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name, d.budget HAVING SUM(e.salary) > d.budget;
```

### hr-006: Longest-Serving Employee per Department
**Prompt:** Find the longest-serving employee (earliest hire_date) in each department. Return department_name, employee_name, and hire_date.
```sql
SELECT d.name AS department_name, e.name AS employee_name, e.hire_date FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.hire_date = (SELECT MIN(e2.hire_date) FROM employees e2 WHERE e2.department_id = e.department_id);
```

---

## 🎬 Movies Dataset

### mv-001: High-Rated Movies After 2010
**Prompt:** Find all movies released after 2010 with a rating above 8.0. Return title, release_year, and rating.
```sql
SELECT title, release_year, rating FROM movies WHERE release_year > 2010 AND rating > 8.0;
```

### mv-002: Average Rating per Genre
**Prompt:** Calculate the average rating for each genre. Return genre and avg_rating rounded to 2 decimal places.
```sql
SELECT genre, ROUND(AVG(rating), 2) AS avg_rating FROM movies GROUP BY genre;
```

### mv-003: Top 5 Highest-Rated Movies
**Prompt:** Find the top 5 highest-rated movies. Return title, genre, and rating, ordered by rating from highest to lowest.
```sql
SELECT title, genre, rating FROM movies ORDER BY rating DESC LIMIT 5;
```

### mv-004: Actors in More Than 3 Movies
**Prompt:** Find actors who have appeared in more than 3 movies. Return actor name and movie_count.
```sql
SELECT a.name, COUNT(*) AS movie_count FROM actors a JOIN cast_members cm ON a.id = cm.actor_id GROUP BY a.id, a.name HAVING COUNT(*) > 3;
```

### mv-005: Genre with Most Reviews
**Prompt:** Find which movie genre has received the most total reviews. Return genre and review_count, ordered from most to fewest.
```sql
SELECT m.genre, COUNT(r.id) AS review_count FROM movies m JOIN reviews r ON m.id = r.movie_id GROUP BY m.genre ORDER BY review_count DESC;
```

### mv-006: Movies with No Reviews
**Prompt:** Find all movies that have not received any reviews. Return title and release_year.
```sql
SELECT m.title, m.release_year FROM movies m LEFT JOIN reviews r ON m.id = r.movie_id WHERE r.id IS NULL;
```

### mv-007: Top 5-Star Reviewer
**Prompt:** Find the reviewer who has given the most 5-star reviews. Return reviewer_name and five_star_count.
```sql
SELECT reviewer_name, COUNT(*) AS five_star_count FROM reviews WHERE score = 5 GROUP BY reviewer_name ORDER BY five_star_count DESC LIMIT 1;
```

### mv-008: Prolific Reviewers' Average Score
**Prompt:** Find the average score given by each reviewer who has submitted 5 or more reviews. Return reviewer_name and avg_score rounded to 2 decimal places.
```sql
SELECT reviewer_name, ROUND(AVG(score), 2) AS avg_score FROM reviews GROUP BY reviewer_name HAVING COUNT(*) >= 5;
```
