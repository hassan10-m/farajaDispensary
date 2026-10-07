import React, { useState } from 'react';
import { Bills, Patients } from '../data/storage.js';

export default function BillingPage() {
  const [bills, setBills] = useState(Bills.all());

  function getPatientName(id) {
    return Patients.getById(id)?.name || 'Unknown';
  }

  function markPaid(id) {
    Bills.markPaid(id);
    setBills(Bills.all());
  }

  return (
    <div>
      <h2>Billing</h2>
      <div className="card">
        {bills.length === 0 ? (
          <div className="empty-state">No bills yet.</div>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Patient</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {bills.map((b) => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{getPatientName(b.patientId)}</td>
                  <td>Tsh {b.total.toLocaleString()}</td>
                  <td>
                    <span className={`badge ${b.status === 'paid' ? 'done' : 'wait'}`}>
                      {b.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td>
                    {b.status !== 'paid' && (
                      <button className="ghost" onClick={() => markPaid(b.id)}>Mark as paid</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
