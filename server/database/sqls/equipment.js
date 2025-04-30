// server/database/sqls/equipment.js

// 전체 리스트
const selectEquipmentList = `
  SELECT 
    equipment_code,
    equipment_name,
    equipment_type,
    install_date,
    manufacturer,
    capacity,
    next_inspection_dt,
    is_suitable
  FROM equipments
  ORDER BY equipment_code
`;

// 설비코드로 조회
const selectEquipmentByCode = `
  SELECT 
    equipment_code,
    equipment_name,
    equipment_type,
    install_date,
    manufacturer,
    capacity,
    next_inspection_dt,
    is_suitable
  FROM equipments
  WHERE equipment_code = ?
`;

// 설비명으로 조회 (부분일치)
const selectEquipmentByName = `
  SELECT 
    equipment_code,
    equipment_name,
    equipment_type,
    install_date,
    manufacturer,
    capacity,
    next_inspection_dt,
    is_suitable
  FROM equipments
  WHERE equipment_name LIKE ?
  ORDER BY equipment_code
`;

// 제조사로 조회
const selectEquipmentByManufacturer = `
  SELECT 
    equipment_code,
    equipment_name,
    equipment_type,
    install_date,
    manufacturer,
    capacity,
    next_inspection_dt,
    is_suitable
  FROM equipments
  WHERE manufacturer = ?
  ORDER BY equipment_code
`;

module.exports = {
  selectEquipmentList,
  selectEquipmentByCode,
  selectEquipmentByName,
  selectEquipmentByManufacturer,
};
