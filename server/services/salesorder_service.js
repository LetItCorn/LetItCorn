// services/salesorder_service.js
const mariadb = require('../database/mapper.js');
const { convertObjToAry } = require('../utils/converts.js');

// 주문서 전체 조회
const findAllSalesOrders = async () => {
    let list = await mariadb.query('selectSalesOrderList')
        .catch(err => console.error(err));
    return list;
};

// 주문서 코드로 조회
const findSalesOrderByCode = async (orderCode) => {
    let order = await mariadb.query('selectSalesOrderOne', ['', orderCode, '', '', ''])
        .catch(err => console.error(err));
    return order[0]; // 단일 결과 반환
};

// 주문서 검색 조건별 조회
const findSalesOrdersByCondition = async (conditions) => {
    let { sorderCode, clientName, clientMgr, itemName, sorderCount, deliveryDate } = conditions;
    
    // 기본값 처리
    sorderCode = sorderCode || '';
    clientName = clientName || '';
    clientMgr = clientMgr || '';
    itemName = itemName || '';
    sorderCount = sorderCount || '';
    deliveryDate = deliveryDate || '';
    
    let orders = await mariadb.query('selectSalesOrderOne', [sorderCode, clientName, clientMgr, itemName, sorderCount, deliveryDate])
        .catch(err => console.error(err));
    return orders;
};

// 주문서 수정
const updateSalesOrderInfo = async (sorderCode, updateData) => {

    const allowedFields = {
        sorder_count : updateData.sorder_count,
        delivery_date : updateData.delivery_date,
    };

    const filteredData = {};
    Object.entries(allowedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            filteredData[key] = value;
        }
    });

    let data = [filteredData, sorderCode];
    
    let resInfo = await mariadb.query('updateSalesOrder', data).catch(err => {
                    console.error(err);
                    throw err;
    });

    result = null;

    if (resInfo.affectedRows > 0) {
        updateData.sordercode = sorderCode;
        console.log('성공');
        result = {
            isUpdated: true,
            message: '주문서가 수정되었습니다.',
            data: {...filteredData, sorder_code: sorderCode}
        };
    } else {
        console.log('실패');
        result = {
            isUpdated: false,
            message: '주문서 수정에 실패했습니다.',
        };
    }
    
    return result;
};

// 주문서 삭제
const removeSalesOrder = async (orderCode) => {
    await mariadb.query('deleteSalesOrder', [orderCode])
        .catch(err => {
            console.error(err);
            throw err;
        });
    return { success: true, message: '주문서가 삭제되었습니다.' };
};

// 정렬 기능
const findSalesOrdersBySort = async (sortType) => {
    let query;
    
    switch (sortType) {
        case 'delivery_date':
            query = 'selectSalesOrderByDeliveryDate';
            break;
        case 'sorder_code':
            query = 'selectSalesOrderBySorderCode';
            break;
        case 'client_name':
            query = 'selectSalesOrderByClientName';
            break;
        case 'item_name':
            query = 'selectSalesOrderByItemName';
            break;
        case 'client_mgr':
            query = 'selectSalesOrderByClientMgr';
            break;
        default:
            query = 'selectSalesOrderList';
    }
    
    let orders = await mariadb.query(query)
        .catch(err => console.error(err));
    return orders;
};

// 입고번호 생성 함수
const generateShipmentNo = () => {
  const today = new Date();
  const year = today.getFullYear().toString().slice(2, 4);
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `SHP${year}${month}${day}${randomNum}`;
};

// 출고 처리
const registerShipment = async (shipmentData) => {
    let conn;
    try {
        console.log('registerShipment 함수 호출:', shipmentData);
        conn = await mariadb.getConnection();
        
        // 트랜잭션 시작
        await conn.beginTransaction();
        
        const { sorder_code, item_code, shipment_qty, emp_id } = shipmentData;
        const shipment_no = generateShipmentNo(); // 출고번호 생성
        const shipment_date = new Date().toISOString().slice(0, 10); // 현재 날짜
        
        console.log('출고 정보:', { shipment_no, sorder_code, item_code, shipment_qty, shipment_date, emp_id });
        
        // 1. 재고 확인
        console.log('재고 확인 쿼리 실행:', item_code);
        const stockResult = await conn.query(`
            SELECT current_stock
            FROM finishedproduct
            WHERE item_code = ?
        `, [item_code]);
        
        console.log('재고 확인 결과:', stockResult);
        
        if (!stockResult || stockResult.length === 0) {
            console.log('재고 정보를 찾을 수 없음:', item_code);
            throw new Error(`재고 정보를 찾을 수 없습니다. (품목코드: ${item_code})`);
        }
        
        const currentStock = stockResult[0].current_stock;
        console.log('현재 재고량:', currentStock);
        
        if (currentStock < shipment_qty) {
            console.log('재고 부족:', { currentStock, shipment_qty });
            throw new Error(`재고가 부족합니다. (현재 재고: ${currentStock}, 요청 수량: ${shipment_qty})`);
        }
        
        // 2. 출고 이력 저장
        console.log('출고 이력 저장 시작');
        try {
            await conn.query(`
                INSERT INTO shipment_history (
                    shipment_no,
                    sorder_code,
                    item_code,
                    shipment_qty,
                    shipment_date,
                    emp_id
                )
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                shipment_no,
                sorder_code,
                item_code,
                shipment_qty,
                shipment_date,
                emp_id
            ]);
            console.log('출고 이력 저장 완료');
        } catch (insertError) {
            console.error('출고 이력 저장 중 오류:', insertError);
            
            // 테이블이 없을 경우 테이블 생성 시도
            if (insertError.errno === 1146) { // "Table doesn't exist" 오류
                console.log('출고 이력 테이블 생성 시도');
                await conn.query(`
                    CREATE TABLE IF NOT EXISTS shipment_history (
                        shipment_no VARCHAR(20) PRIMARY KEY,
                        sorder_code VARCHAR(20) NOT NULL,
                        item_code VARCHAR(20) NOT NULL,
                        shipment_qty INT NOT NULL,
                        shipment_date DATE NOT NULL,
                        emp_id VARCHAR(20) NOT NULL,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                `);
                
                // 테이블 생성 후 다시 시도
                await conn.query(`
                    INSERT INTO shipment_history (
                        shipment_no,
                        sorder_code,
                        item_code,
                        shipment_qty,
                        shipment_date,
                        emp_id
                    )
                    VALUES (?, ?, ?, ?, ?, ?)
                `, [
                    shipment_no,
                    sorder_code,
                    item_code,
                    shipment_qty,
                    shipment_date,
                    emp_id
                ]);
                console.log('출고 이력 테이블 생성 및 저장 완료');
            } else {
                // 다른 오류는 그대로 던짐
                throw insertError;
            }
        }
        
        // 3. 재고 업데이트 (감소)
        console.log('재고 업데이트 시작:', { shipment_qty, item_code });
        await conn.query(`
            UPDATE finishedproduct
            SET current_stock = current_stock - ?
            WHERE item_code = ?
        `, [shipment_qty, item_code]);
        console.log('재고 업데이트 완료');
        
        // 4. 주문서 상태 업데이트 (출고 완료)
        console.log('주문서 상태 업데이트 시작:', sorder_code);
        await conn.query(`
            UPDATE salesorder
            SET code_values = 'J06'
            WHERE sorder_code = ?
        `, [sorder_code]);
        console.log('주문서 상태 업데이트 완료');
        
        // 트랜잭션 커밋
        await conn.commit();
        console.log('트랜잭션 커밋 완료');
        
        return {
            success: true,
            message: '출고가 성공적으로 등록되었습니다.',
            shipment_no
        };
    } catch (err) {
        // 오류 발생 시 롤백
        if (conn) {
            await conn.rollback();
            console.log('트랜잭션 롤백 완료');
        }
        console.error('출고 등록 중 오류:', err);
        return {
            success: false,
            message: err.message || '출고 등록에 실패했습니다.'
        };
    } finally {
        // 연결 반환
        if (conn) {
            conn.release();
            console.log('DB 연결 반환 완료');
        }
    }
};

// 출고 이력 조회
const findAllShipments = async () => {
    let list = await mariadb.query('selectShipmentHistoryList')
        .catch(err => console.error(err));
    return list;
};

module.exports = {
    findAllSalesOrders,
    findSalesOrderByCode,
    findSalesOrdersByCondition,
    updateSalesOrderInfo,
    removeSalesOrder,
    findSalesOrdersBySort,
    registerShipment,
    findAllShipments
};
