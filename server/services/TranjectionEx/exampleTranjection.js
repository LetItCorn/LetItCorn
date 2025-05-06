// const mariaDB = require('../mapper/mapper');

// 트랜젝션 열고닫는거 컨트롤하는 코드.
// const proddtlist = async(orderId)=>{
//     let conn;
//     try{
//         conn = await mariaDB.getConnection();
//         await conn.beginTransaction();

//         // 실제 SQL문을 가지고 오는 작업
//         selectedSql = await mariaDB.selectedQuery('selectproddetail', orderId);
//         // 해당 connection을 기반으로 실제 SQL문을 실행하는 메서드
//         let list = await conn.query(selectedSql, orderId);

//         // selectedSql = await mariaDB.selectedQuery('selectprod', orderId);
//         // let result = await conn.query(selectedSql);
//         conn.commit();
        
//         return list;
//      에러 뜨면 rollback
//     }catch(err){
//         if(conn) conn.rollback();
//     커넥션 초기화
//     }finally{
//         if(conn) conn.release();
//     }
    
// }

// module.exports = {
   
// }
