const db = require('./config/db');
require('dotenv').config();

// Create Medicine table
const createMedicineTable = `
  CREATE TABLE IF NOT EXISTS Medicine (
    MedicineID INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Category VARCHAR(100),
    Price DECIMAL(10,2) NOT NULL,
    Stock INT DEFAULT 0,
    Manufacturer VARCHAR(255),
    Description TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

// Insert sample medicines
const insertMedicines = `
  INSERT INTO Medicine (Name, Category, Price, Stock, Manufacturer, Description) VALUES
  ('Paracetamol 500mg', 'Pain Relief', 25.00, 500, 'PharmaCorp', 'For fever and mild to moderate pain'),
  ('Amoxicillin 250mg', 'Antibiotic', 45.00, 300, 'MedTech', 'Broad-spectrum antibiotic'),
  ('Cough Syrup 100ml', 'Cough & Cold', 120.00, 200, 'HealthCare', 'Relieves dry and wet cough'),
  ('Antacid Tablets', 'Digestive', 35.00, 400, 'PharmaCorp', 'For acidity and heartburn'),
  ('Cetirizine 10mg', 'Antihistamine', 28.00, 350, 'MedTech', 'For allergies and itching'),
  ('Dolo 650', 'Pain Relief', 30.00, 450, 'HealthCare', 'For severe pain and fever'),
  ('Azithromycin 250mg', 'Antibiotic', 85.00, 250, 'PharmaCorp', 'For bacterial infections'),
  ('Vitamin D3 60000IU', 'Vitamins', 150.00, 180, 'MedTech', 'Bone health and immunity'),
  ('Ciprofloxacin 500mg', 'Antibiotic', 65.00, 220, 'HealthCare', 'For urinary and respiratory infections'),
  ('Omeprazole 20mg', 'Digestive', 42.00, 320, 'PharmaCorp', 'For GERD and acid reflux'),
  ('Ibuprofen 400mg', 'Pain Relief', 40.00, 380, 'MedTech', 'Anti-inflammatory and pain relief'),
  ('Augmentin 625mg', 'Antibiotic', 95.00, 200, 'HealthCare', 'For severe bacterial infections'),
  ('Losartan 50mg', 'Blood Pressure', 55.00, 280, 'PharmaCorp', 'For hypertension'),
  ('Metformin 500mg', 'Diabetes', 38.00, 420, 'MedTech', 'For type 2 diabetes management'),
  ('Atorvastatin 10mg', 'Heart Health', 48.00, 300, 'HealthCare', 'Cholesterol management')
`;

db.query(createMedicineTable, (err) => {
  if (err) {
    console.error('Error creating Medicine table:', err);
    process.exit(1);
  }
  console.log('✅ Medicine table ready');

  db.query('SELECT COUNT(*) as count FROM Medicine', (err, rows) => {
    if (err) {
      console.error('Error checking medicines:', err);
      process.exit(1);
    }
    
    if (rows[0].count === 0) {
      db.query(insertMedicines, (err2) => {
        if (err2) {
          console.error('Error inserting medicines:', err2);
          process.exit(1);
        }
        console.log('✅ Sample medicines inserted');
        process.exit(0);
      });
    } else {
      console.log('✅ Medicines already exist');
      process.exit(0);
    }
  });
});

