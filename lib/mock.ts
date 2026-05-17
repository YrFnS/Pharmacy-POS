export const mockProducts = [
  {
    id: "p1",
    barcode: "890113830023",
    brandName: "Panadol Advance 500mg",
    genericName: "Paracetamol",
    category: "Pain Relief",
    batches: [
      { id: "b1_1", batchNo: "A1029", expiryDate: "2026-10-01", quantity: 50, price: 2500 },
      { id: "b1_2", batchNo: "A1010", expiryDate: "2024-12-01", quantity: 15, price: 2500 },
    ]
  },
  {
    id: "p2",
    barcode: "501270410052",
    brandName: "Augmentin 1g",
    genericName: "Amoxicillin / Clavulanate",
    category: "Antibiotics",
    batches: [
      { id: "b2_1", batchNo: "X882", expiryDate: "2025-06-15", quantity: 20, price: 15000 },
    ]
  },
  {
    id: "p3",
    barcode: "366479802111",
    brandName: "Lipitor 20mg",
    genericName: "Atorvastatin",
    category: "Cholesterol",
    batches: [
      { id: "b3_1", batchNo: "LIP20", expiryDate: "2027-01-20", quantity: 100, price: 35000 },
    ]
  },
  {
    id: "p4",
    barcode: "88019239100",
    brandName: "Ventolin Inhaler 100mcg",
    genericName: "Salbutamol",
    category: "Respiratory",
    batches: [
      { id: "b4_1", batchNo: "VEN99", expiryDate: "2026-08-10", quantity: 30, price: 8000 },
      { id: "b4_2", batchNo: "VEN88", expiryDate: "2024-11-01", quantity: 5, price: 8000 },
    ]
  },
  {
    id: "p5",
    barcode: "3400934920256",
    brandName: "Doliprane 1000mg",
    genericName: "Paracetamol",
    category: "Pain Relief",
    batches: [
      { id: "b5_1", batchNo: "DOL1K", expiryDate: "2025-11-30", quantity: 80, price: 4000 },
    ]
  },
  {
    id: "p6",
    barcode: "4004944015008",
    brandName: "Voltaren Emulgel 50g",
    genericName: "Diclofenac Diethylamine",
    category: "Topical Pain Relief",
    batches: [
      { id: "b6_1", batchNo: "VOLT1", expiryDate: "2026-03-22", quantity: 45, price: 12000 },
      { id: "b6_2", batchNo: "VOLT2", expiryDate: "2026-09-01", quantity: 60, price: 12000 },
    ]
  },
  {
    id: "p7",
    barcode: "5000158066113",
    brandName: "Gaviscon Double Action",
    genericName: "Sodium Alginate / Antacid",
    category: "Gastrointestinal",
    batches: [
      { id: "b7_1", batchNo: "GAV6", expiryDate: "2025-05-15", quantity: 24, price: 9500 },
    ]
  },
  {
    id: "p8",
    barcode: "6281086001045",
    brandName: "Amoxil 500mg Caps",
    genericName: "Amoxicillin",
    category: "Antibiotics",
    batches: [
      { id: "b8_1", batchNo: "AMX500", expiryDate: "2027-02-14", quantity: 150, price: 6000 },
    ]
  },
  {
    id: "p9",
    barcode: "8901117009028",
    brandName: "Cataflam 50mg",
    genericName: "Diclofenac Potassium",
    category: "Pain Relief",
    batches: [
      { id: "b9_1", batchNo: "CAT50", expiryDate: "2024-10-10", quantity: 12, price: 5500 },
    ]
  },
  {
    id: "p10",
    barcode: "3582452093417",
    brandName: "Zyrtec 10mg",
    genericName: "Cetirizine",
    category: "Antihistamine",
    batches: [
      { id: "b10_1", batchNo: "ZYR10", expiryDate: "2026-12-05", quantity: 200, price: 8000 },
    ]
  }
];

export const mockCustomers = [
  { id: "c1", name: "Walk-in Customer", phone: "", debt: 0 },
  { id: "c2", name: "Ahmed Hassan", phone: "07701234567", debt: 15000 },
  { id: "c3", name: "Sarah Ali", phone: "07809876543", debt: 0 },
  { id: "c4", name: "Mohammed Al-Rubaie", phone: "07901112233", debt: 45000 },
  { id: "c5", name: "Fatima Zahra", phone: "07712223344", debt: 2000 },
  { id: "c6", name: "Omar Tariq", phone: "07813334455", debt: 0 },
  { id: "c7", name: "Zainab Kareem", phone: "07504445566", debt: 120000 },
];
