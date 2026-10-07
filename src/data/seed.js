// seed.js
// Sets up initial demo data the first time the app runs (if localStorage is empty).
import { KEYS } from './storage.js';

export function seedInitialData() {
  const alreadySeeded = localStorage.getItem('dispensary_seeded');
  if (alreadySeeded) return;

  const users = [
    { id: 'U-0001', name: 'Amina Juma', username: 'reception', password: '1234', role: 'reception' },
    { id: 'U-0002', name: 'Dr. Musa Ali', username: 'doctor', password: '1234', role: 'doctor' },
    { id: 'U-0003', name: 'Fatuma Said', username: 'pharmacist', password: '1234', role: 'pharmacist' },
    { id: 'U-0004', name: 'Hassan Manager', username: 'manager', password: '1234', role: 'manager' },
  ];

  const medicines = [
    { id: 'M-0001', name: 'Paracetamol 500mg', quantityInStock: 200, price: 200, expiryDate: '2027-06-01', lowStockThreshold: 20 },
    { id: 'M-0002', name: 'Amoxicillin 500mg', quantityInStock: 15, price: 500, expiryDate: '2026-12-01', lowStockThreshold: 20 },
    { id: 'M-0003', name: 'ORS (Oral Rehydration Salts)', quantityInStock: 50, price: 300, expiryDate: '2027-01-01', lowStockThreshold: 10 },
  ];

  localStorage.setItem(KEYS.users, JSON.stringify(users));
  localStorage.setItem(KEYS.medicines, JSON.stringify(medicines));
  localStorage.setItem(KEYS.patients, JSON.stringify([]));
  localStorage.setItem(KEYS.visits, JSON.stringify([]));
  localStorage.setItem(KEYS.prescriptions, JSON.stringify([]));
  localStorage.setItem(KEYS.bills, JSON.stringify([]));
  localStorage.setItem('dispensary_seeded', 'yes');
}
