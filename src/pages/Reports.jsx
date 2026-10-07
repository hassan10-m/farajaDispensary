import React, { useMemo, useState } from 'react';
import { Visits, Bills, Prescriptions, Medicines } from '../data/storage.js';

export default function ReportsPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const stats = useMemo(() => {
    const visitsForDate = Visits.all().filter((v) => v.date === date);
    const billsForDate = Bills.all().filter((b) => {
      const visit = Visits.getById(b.visitId);
      return visit && visit.date === date;
    });
    const revenueForDate = billsForDate.reduce((sum, b) => sum + b.total, 0);

    const medicineCounts = {};
    Prescriptions.all().forEach((rx) => {
      const visit = Visits.getById(rx.visitId);
      if (!visit || visit.date !== date) return;
      rx.items.forEach((it) => {
        const med = Medicines.getById(it.medicineId);
        const name = med ? med.name : it.medicineId;
        medicineCounts[name] = (medicineCounts[name] || 0) + it.quantity;
      });
    });

    return {
      patientCount: visitsForDate.length,
      revenueForDate,
      topMedicines: Object.entries(medicineCounts).sort((a, b) => b[1] - a[1]),
    };
  }, [date]);

  function downloadCSV() {
    const rows = [
      ['Metric', 'Value'],
      ['Date', date],
      ['Number of patients', stats.patientCount],
      ['Total revenue (Tsh)', stats.revenueForDate],
      [],
      ['Medicine', 'Quantity dispensed'],
      ...stats.topMedicines,
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <h2>Reports</h2>

      <div className="card">
        <label>Select date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ maxWidth: 200 }} />
      </div>

      <div className="grid-2">
        <div className="card">
          <label>Number of patients</label>
          <div style={{ fontSize: 28, fontWeight: 600 }}>{stats.patientCount}</div>
        </div>
        <div className="card">
          <label>Total revenue</label>
          <div style={{ fontSize: 28, fontWeight: 600 }}>Tsh {stats.revenueForDate.toLocaleString()}</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Most dispensed medicines</h3>
        {stats.topMedicines.length === 0 ? (
          <div className="empty-state">No medicines dispensed on this date.</div>
        ) : (
          <table>
            <thead><tr><th>Medicine</th><th>Quantity</th></tr></thead>
            <tbody>
              {stats.topMedicines.map(([name, qty]) => (
                <tr key={name}><td>{name}</td><td>{qty}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        <button className="ghost" onClick={downloadCSV} style={{ marginTop: 14 }}>Download CSV</button>
      </div>
    </div>
  );
}
