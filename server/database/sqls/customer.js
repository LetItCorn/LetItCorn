// server/database/sqls/salesorder.js
module.exports = {
    // 거래처 목록 조회
    selectCustomerList: 
    `SELECT
        c.client_code,
        c.client_name,
        c.client_ceo,
        c.client_phone,
        c.client_email,
        c.client_address,
        c.client_mgr,
        com.code_name
    FROM client AS c
    JOIN common_codes AS com
    ON c.code_values = com.code_values
    ORDER BY c.client_code`,
};
