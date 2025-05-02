const menuConfig = {
  영업: {
    "주문서": [{
        name: "거래업체 주문서 조회",
        path: 'Salesorder'
      },
      {
        name: "주문서 등록",
        path: '#'
      }
    ],
    "발주서": [{
        name: "협력 업체 발주서 조회",
        path: '#'
      },
      {
        name: "발주서 등록",
        path: '#'
      }
    ],
    "거래처": [{
        name: "거래처 조회",
        path: '#'
      },
      {
        name: "거래처 등록",
        path: '#'
      }
    ],
    "완제품 입고": [{
        name: "완제품 조회",
        path: '#'
      },
      {
        name: "완제품 등록",
        path: '#'
      }
    ],
    "반제품 입고": [{
        name: "반제품 조회",
        path: '#'
      },
      {
        name: "반제품 등록",
        path: '#'
      }
    ],
    "반품입고": [{
        name: "반품조회",
        path: '#'
      }, {
        name: "반품등록",
        path: '#'
      },
      {
        name: "폐기 확인서 등록",
        path: '#'
      }
    ],
  },
  생산: {
    "공정관리": [{
        name: "공정진행",
        path: 'proc'
      }, {
        name: "공정이력조회",
        path: '#'
      },

    ],
    "품질관리": [{
        name: "품질검사조회",
        path: '#'
      }, {
        name: "불량관리",
        path: '#'
      },

    ],
    "설비관리": [{
        name: "설비 현황",
        path: '#'
      },

    ],
    "생산계획": [{
        name: "조회",
        path: '#'
      }, {
        name: "작성",
        path: 'plan'
      },

    ],
    "생산지시": [{
      name: "조회",
      path: '#'
    }, {
      name: "작성",
      path: '#'
    }, ],
  },
  자재: {
    "자재재고": [{
        name: "조회",
        path: 'leeTest'
      }, {
        name: "LOT조회",
        path: '#'
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
      path: '#'
    },
    {
      name: "조회",
      path: '#'
    }
  ],
  "자재품질": [{
    name: "조회",
    path: '#'
  }, {
    name: "등록",
    path: '#'
  },

],
  },
  관리: {
    "사원": [{
      name: "사원목록",
      path: '#'
    }, ],
    "품목": [{
      name: "품목 목록",
      path: 'items'
    }, ],
    "설비": [{
      name: "설비 목록",
      path: '#'
    }, ],
    "공정": [{
      name: "공정 목록",
      path: '#'
    }, ],
    "불량": [{
      name: "불량 목록",
      path: '#'
    }, ],
    "BOM": [{
      name: "BOM 목록",
      path: 'boms'
    }, ],

  }

}
module.exports = {
  menuConfig
};