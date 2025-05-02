// 로그인
const findUserByUserId = 
`SELECT user_id, 
        user_passd,
        emp_name
FROM employees
WHERE user_id = ?`;

module.exports = {
  findUserByUserId,
}
