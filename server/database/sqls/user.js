// id 기준 조회 => emp_id 조회
const findUserByUserId = 
`SELECT user_id, 
        user_passd
FROM employees
WHERE user_id = ?`;

module.exports = {
  findUserByUserId,
}
