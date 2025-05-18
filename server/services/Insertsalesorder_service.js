// services/Insertsalesorder_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 등록
const addSalesOrder = async (orderinfo) => {

    const sorderCode = await generateSalesOrderCode();
    console.log('생성된 주문번호 : ', sorderCode);

    orderinfo.sorder_code = sorderCode;

    let insertOrder = [
        'sorder_code',
        'client_code',
        'item_code',
        'delivery_date',
        'sorder_count',
        'code_values',
        'emp_id'
    ];

    let data  = convertObjToAry(orderinfo, insertOrder);

    let resInfo = await mariadb.query('insertSalesOrder', data)
                                .catch(err => console.log(err));

    console.log('결과',resInfo);
    console.log('결과내용',resInfo.affectedRows);

    let result = null;

    if(resInfo.affectedRows > 0){  //affetedRows 라고 적혀있었음 
        console.log('성공');
        result = {
            isSuccessed : true,
            message : '주문서가 등록되었습니다.',
        };
    } else {
        console.log('실패');
        result = {
            isSuccessed : false,
            message : '주문서 등록에 실패했습니다.',
        };
    }
    return result;
};

// 거래처 목록 조회
const findAllClients = async () => {
    let clients = await mariadb.query('selectClientList')
        .catch(err => console.error(err));
    return clients;
};

// 품목 목록 조회
const findAllItems = async () => {
    let items = await mariadb.query('selectItemList')
        .catch(err => console.error(err));
    return items;
};

// 주문번호 생성 함수 - getConnection 사용
const generateSalesOrderCode = async () => {
    let conn;
    try {
        // 연결 가져오기
        conn = await mariadb.getConnection();
        
        // 프로시저 호출
        await conn.query('CALL GENSALESORDERCODE(@result)');
        
        // 결과 조회
        const rows = await conn.query('SELECT @result AS sorder_code');
        
        if (rows && rows.length > 0 && rows[0].sorder_code) {
            return rows[0].sorder_code;
        } else {
            // 결과가 없으면 대체 코드 생성
            return generateFallbackCode();
        }
    } catch (err) {
        console.error('주문번호 생성 중 오류 발생:', err);
        // 오류 발생 시 대체 코드 생성
        return generateFallbackCode();
    } finally {
        // 연결 반환
        if (conn) {
            conn.release();
        }
    }
};

// 대체 주문번호 생성 함수
const generateFallbackCode = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SON${year}${month}${day}${randomNum}`;
};

module.exports = {
    addSalesOrder,
    findAllClients,
    findAllItems,
    generateSalesOrderCode
};