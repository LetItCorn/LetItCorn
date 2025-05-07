 const selectOrder = 
`SELECT so.sorder_code, 
        so.item_code, 
        i.item_name, 
        i.spec, 
        so.sorder_count, 
        so.delivery_date 
 FROM salesorder so 
 JOIN items i ON so.item_code = i.item_code
 WHERE so.sorder_code = ? 
 ORDER BY so.sorder_code`;

const selectByWriteDate =
`SELECT so.sorder_code,
        so.item_code,  
        i.item_name, 
        i.spec,
        so.sorder_count,
        so.delivery_date
 FROM salesorder so
 JOIN items i ON so.item_code = i.item_code
 WHERE SUBSTRING(so.sorder_code, 4, 6) BETWEEN ? AND ?
 ORDER BY so.sorder_code DESC`;

const selectByEndDate =
`SELECT so.sorder_code
       , so.item_code 
       , i.item_name   
       , i.spec        
       , so.sorder_count 
       , so.delivery_date
FROM salesorder so
JOIN items i ON so.item_code = i.item_code
WHERE so.end_date BETWEEN ? AND ?
ORDER BY so.end_date DESC`;

module.exports = {
selectOrder,
selectByWriteDate,
selectByEndDate,
}
