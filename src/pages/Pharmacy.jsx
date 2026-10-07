import React, { useState } from 'react';
import { Medicines, Prescriptions, Visits, Patients } from '../data/storage.js';

const EMPTY_FORM = { name: '', quantityInStock: 0, price: 0, expiryDate: '', lowStockThreshold: 10 };

export default function PharmacyPage() {
  const [medicines, setMedicines] = useState(Medicines.all());
  const [prescriptions, setPrescriptions] = useState(Prescriptions.pending());
  const [form, setForm] = useState(EMPTY_FORM);
  const [showForm, setShowForm] = useState(false);

  function addMedicine(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    Medicines.add(form);
    setMedicines(Medicines.all());
    setForm(EMPTY_FORM);
    setShowForm(false);
  }

  function getPatientNameForVisit(visitId) {
    const visit = Visits.getById(visitId);
    return visit ? Patients.getById(visit.patientId)?.name : 'Unknown';
  }

  function dispense(prescription) {
    const insufficient = prescription.items.filter((it) => {
      const med = Medicines.getById(it.medicineId);
      return !med || med.quantityInStock < it.quantity;
    });

    prescription.items.forEach((it) => {
      const med = Medicines.getById(it.medicineId);
      if (med && med.quantityInStock > 0) {
        const amountToGive = Math.min(it.quantity, med.quantityInStock);
        Medicines.reduceStock(it.medicineId, amountToGive);
      }
    });

    Prescriptions.updateStatus(prescription.id, insufficient.length ? 'partially_dispensed' : 'dispensed');
    setPrescriptions(Prescriptions.pending());
    setMedicines(Medicines.all());
  }

  const lowStock = Medicines.lowStock();

  return (
    <div>
      <h2>Medicines & stock</h2>

      {lowStock.length > 0 && (
        <div className="card">
          <strong>Low stock alert</strong>
          <table style={{ marginTop: 10 }}>
            <thead><tr><th>Medicine</th><th>Quantity in stock</th></tr></thead>
            <tbody>
              {lowStock.map((m) => (
                <tr key={m.id}>
                  <td>{m.name}</td>
                  <td><span className="badge danger">{m.quantityInStock}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Pending prescriptions</h3>
        {prescriptions.length === 0 ? (
          <div className="empty-state">No prescriptions pending.</div>
        ) : (
          <table>
            <thead><tr><th>Patient</th><th>Medicines</th><th></th></tr></thead>
            <tbody>
              {prescriptions.map((rx) => (
                <tr key={rx.id}>
                  <td>{getPatientNameForVisit(rx.visitId)}</td>
                  <td>
                    {rx.items.map((it) => Medicines.getById(it.medicineId)?.name + ' x' + it.quantity).join(', ')}
                  </td>
                  <td><button className="ghost" onClick={() => dispense(rx)}>Dispense</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0 }}>Medicine stock</h3>
          <button className="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close' : 'Add medicine'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={addMedicine} style={{ marginTop: 16 }}>
            <div className="grid-2">
              <div>
                <label>Medicine name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label>Quantity in stock</label>
                <input type="number" value={form.quantityInStock} onChange={(e) => setForm({ ...form, quantityInStock: Number(e.target.value) })} />
              </div>
              <div>
                <label>Price (Tsh)</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div>
                <label>Expiry date</label>
                <input type="date" value={form.expiryDate} onChange={(e) => setForm({ ...form, expiryDate: e.target.value })} />
              </div>
            </div>
            <button className="primary" type="submit">Save medicine</button>
          </form>
        )}

        <table style={{ marginTop: 16 }}>
          <thead><tr><th>Medicine</th><th>Quantity</th><th>Price</th><th>Expiry date</th></tr></thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.quantityInStock}</td>
                <td>Tsh {m.price}</td>
                <td>{m.expiryDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
