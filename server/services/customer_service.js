const mariadb = require("../database/mapper.js");
const { convertObjToAry } = require('../utils/converts.js');

// 거래처 전체 조회
const findAllCustomer = async () => {
    let list = await mariadb.query('selectCustomerList')
        .catch(err => console.error(err));
    return list;
};

// 주문서 검색 조건별 조회
const findCustomerByCondition = async (conditions) => {
    let { clientCode, clientName, clientCeo, clientPhone, clientEmail, clientAddress, clientMgr, codeName } = conditions;
    
    // 기본값 처리
    clientCode = clientCode || '';
    clientName = clientName || '';
    clientCeo = clientCeo || '';
    clientPhone = clientPhone || '';
    clientEmail = clientEmail || '';
    clientAddress = clientAddress || '';
    clientMgr = clientMgr || '';
    codeName = codeName || '';
    
    let customers = await mariadb.query('selectCustomerOne', [clientCode, clientName, clientCeo, clientPhone, clientEmail, clientAddress, clientMgr, codeName])
        .catch(err => console.error(err));
    return customers;

};

// 주문서 수정
const updateCustomerInfo = async (clientCode, updateData) => {

    const allowedFields = {
        client_name : updateData.client_name,
        client_ceo : updateData.client_ceo,
        client_phone : updateData.client_phone,
        client_email : updateData.client_email,
        client_address : updateData.client_address,
        client_mgr : updateData.client_mgr,
    };

    const filteredData = {};
    Object.entries(allowedFields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            filteredData[key] = value;
        }
    });

    let data = [filteredData, clientCode];
    
    let resInfo = await mariadb.query('updateCustomer', data).catch(err => {
                    console.error(err);
                    throw err;
    });

    result = null;

    if (resInfo.affectedRows > 0) {
        updateData.clientcode = clientCode;
        console.log('성공');
        result = {
            isUpdated: true,
            message: '거래처가 수정되었습니다.',
            data: {...filteredData, client_code: clientCode}
        };
    } else {
        console.log('실패');
        result = {
            isUpdated: false,
            message: '거래처 수정에 실패했습니다.',
        };
    }
    
    return result;
};

// 주문서 삭제
const removeCustomer = async (clientCode) => {
    await mariadb.query('deleteCustomer', [clientCode])
        .catch(err => {
            console.error(err);
            throw err;
        });
    
    return { success: true, message: '거래처가 삭제되었습니다.' };
};

// 거래처 등록
const addCustomer = async (customerInfo) => {
    let insertCustomer = [
        'client_code',
        'client_name',
        'client_ceo',
        'client_phone',
        'client_email',
        'client_address',
        'client_mgr',
        'code_values'
    ];

    let data  = convertObjToAry(customerInfo, insertCustomer);

    let resInfo = await mariadb.query('insertCustomer', data)
                                .catch(err => console.log(err));

    console.log('결과',resInfo);
    console.log('결과내용',resInfo.affectedRows);

    let result = null;

    if(resInfo.affectedRows > 0){  //affetedRows 라고 적혀있었음 
        console.log('성공');
        result = {
            isSuccessed : true,
            message : '거래처가 등록되었습니다.',
        };
    } else {
        console.log('실패');
        result = {
            isSuccessed : false,
            message : '거래처 등록에 실패했습니다.',
        };
    }
    return result;
}


module.exports = {
    findAllCustomer,
    findCustomerByCondition,
    updateCustomerInfo,
    removeCustomer,
    addCustomer
};