const menuConfig = {
  영업: {
    "주문서": [{
        name: "주문서 목록",
        path: 'Salesorder'
      },
      {
        name: "주문서 등록",
        path: 'Insertsalesorder'
      }
    ],
    "거래처": [{
        name: "거래처 목록",
        path: 'Customer'
      }
    ],
    "완제품": [{
        name: "완제품 목록",
        path: 'FinishedProduct'
      }
    ],
    "완제품 입∙출고": [{
      name: "완제품 품질검사",
      path: 'QInspectionFinishedproduct'
    },
    {
      name: "완제품 입∙출고이력 조회",
      path: 'CheckWFpdHistory'
    }
    ],
    "반품": [{
        name: "반품 목록",
        path: '#'
      }
    ],
  },
  생산: {
    "생산계획": [{
        name: "조회",
        path: 'plans'
      }, {
        name: "작성",
        path: 'plan'
      },

    ],
    "생산지시": [{
      name: "조회",
      path: 'insts'
    }, {
      name: "작성",
      path: 'inst'
    }, ],
    "공정관리": [{
        name: "공정진행",
        path: 'process'
      }, {
        name: "공정이력조회",
        path: 'ProcessLogView'
      },

    ],
    "품질관리": [{
        name: "품질검사조회",
        path: 'QcLog'
      }, 
      {
        name: "불량관리",
        path: 'Fault'
      },

    ],
    "설비관리": [{
        name: "설비 현황",
        path: 'Machin'
      },

    ],
    
  },
  자재: {
    "자재재고": [{
        name: "조회",
        path: 'leeTest'
      }, 
      {
        name: "자재발주",
        path: 'm_orders'
      },
      {
        name: "발주서 조회",
        path: 'm_orderslist'
      },
    ],
    "자재 입∙출고": [{
      name: "입고",
      path: 'm_inbound'
    },{
      name: "출고",
      path: 'm_outbound'
    },
    {
      name: "조회",
      path: 'm_movement'
    }
    ],
    "반제품": [
      {
        name: "반제품 자재출고 처리 페이지",
        path: 'semi-outbound'
      },
      {
        name: "반제품 입고 처리 페이지",
        path: "semi-inbound"
      },
    ],
    "자재품질": [{
      name: "조회",
      path: 'qc_history'
    },
    ],
    "반품 입고": [{ 
    name: "반품조회", 
    path: "returns" 
    },
    { 
    name: "반품등록", 
    path: "returns" 
    }
  ],
  },
  관리: {
    "사원": [{
      name: "사원 관리",
      path: 'employees'
    }, ],
    "품목": [{
      name: "품목 관리",
      path: 'items'
    }, ],
    "자재": [{
      name: "자재 관리",
      path: 'materials'
    }, ],
    "설비": [{
      name: "설비 관리",
      path: 'equipments'
    }, ],
    "공정": [{
      name: "공정 관리",
      path: 'processes'
    }, ],
    "불량": [{
      name: "불량 관리",
      path: 'defects'
    }, ],
    "BOM": [{
      name: "BOM 관리",
      path: 'boms'
    }, ],
    "품질검사": [{
      name: "품질검사 관리",
      path: 'QcMng'
    }, ],
     "공통코드": [{
      name: "공통코드 관리",
      path: 'common_codes'
    }, ],
  }

}
module.exports = {
  menuConfig
};