// 로그인
const findUserByUserId = 
`SELECT user_id, 
        user_passd
FROM employees
WHERE user_id = ?`;

module.exports = {
  findUserByUserId,
}
