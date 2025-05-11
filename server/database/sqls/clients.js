// server/database/sqls/clients.js
const selectClients = `
SELECT
  client_code,
  client_name,
  client_ceo,
  client_phone,
  client_email,
  client_address,
  client_mgr,
  client_type
FROM client
ORDER BY client_code
`;

module.exports = { selectClients };