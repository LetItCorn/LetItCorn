// server/database/sqls/clients.js
const selectClients = `
SELECT
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
    WHERE com.code_values = 'E03'
    ORDER BY c.client_code
`;

module.exports = { selectClients };