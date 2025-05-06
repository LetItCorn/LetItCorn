const selectOrder = 
`SELECT so.sorder_code
, i.item_name
, i.spec
, so.sorder_count
FROM salesorder so JOIN items i ON ( so.item_code = i.item_code)
WHERE so.sorder_code = ? 
ORDER BY so.sorder_code` 

module.exports = {
selectOrder,
}
