const findUserByUserId = 
`SELECT user_id, user_passd
FROM employees
WHERE emp_id = ?`;

module.exports = {
  findUserByUserId,
}
