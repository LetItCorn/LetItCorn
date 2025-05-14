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

    // 거래처 조건 목록 조회
    selectCustomerOne: 
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
    WHERE c.client_code = ? or c.client_name = ? or c.client_ceo = ? or c.client_phone = ? or c.client_email = ? or c.client_address = ? or c.client_mgr = ? or com.code_name = ?
    ORDER BY c.client_code`,

    // 거래처 수정
    updateCustomer: 
    `UPDATE client 
    SET
    ?
    WHERE
    client_code = ?`,

    // 거래처 삭제
    deleteCustomer:
    `DELETE FROM client
    WHERE client_code = ?`,

    // 거래처 등록
    insertCustomer:
    `INSERT INTO client (
        client_code,
        client_name,
        client_ceo,
        client_phone,
        client_email,
        client_address,
        client_mgr,
        code_values
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,

    // 거래처 유형 조회
    selectClientType:
    `SELECT code_name
    FROM common_codes
    WHERE code_group = 'EE'`
};
