import React from 'react';
import { useAuth } from '../components/AuthContext.jsx';
import { Patients, Visits, Prescriptions, Medicines, Bills } from '../data/storage.js';

export default function Dashboard() {
  const { user } = useAuth();
  const allPatients = Patients.all();
  const todaysVisits = Visits.today();
  const waiting = todaysVisits.filter((v) => v.status === 'pending');
  const pendingPrescriptions = Prescriptions.pending();
  const lowStockMedicines = Medicines.lowStock();
  const unpaidBills = Bills.all().filter((b) => b.status === 'unpaid');

  return (
    <div>
      <h2>Welcome, {user.name}</h2>

      <div className="grid-2">
        {(user.role === 'reception' || user.role === 'manager') && (
          <div className="card">
            <label>Registered patients</label>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{allPatients.length}</div>
          </div>
        )}

        {(user.role === 'reception' || user.role === 'doctor' || user.role === 'manager') && (
          <div className="card">
            <label>Waiting today</label>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{waiting.length}</div>
          </div>
        )}

        {(user.role === 'pharmacist' || user.role === 'manager') && (
          <div className="card">
            <label>Pending prescriptions</label>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{pendingPrescriptions.length}</div>
          </div>
        )}

        {(user.role === 'pharmacist' || user.role === 'manager') && (
          <div className="card">
            <label>Medicines running low</label>
            <div style={{ fontSize: 28, fontWeight: 600, color: lowStockMedicines.length ? '#a32d2d' : 'inherit' }}>
              {lowStockMedicines.length}
            </div>
          </div>
        )}

        {(user.role === 'manager' || user.role === 'reception') && (
          <div className="card">
            <label>Unpaid bills</label>
            <div style={{ fontSize: 28, fontWeight: 600 }}>{unpaidBills.length}</div>
          </div>
        )}
      </div>
    </div>
  );
}
