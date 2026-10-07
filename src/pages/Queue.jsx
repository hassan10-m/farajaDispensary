import React, { useState } from 'react';
import { Visits, Patients, Prescriptions, Medicines, Bills } from '../data/storage.js';
import { useAuth } from '../components/AuthContext.jsx';

const STATUS_BADGE = {
  pending: { label: 'Pending', className: 'wait' },
  in_progress: { label: 'In progress', className: 'progress' },
  completed: { label: 'Completed', className: 'done' },
};

export default function QueuePage() {
  const { user } = useAuth();
  const [queue, setQueue] = useState(Visits.today());
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [medicineItems, setMedicineItems] = useState([{ medicineId: '', dosage: '', quantity: 1 }]);
  const allMedicines = Medicines.all();

  function getPatientName(patientId) {
    return Patients.getById(patientId)?.name || 'Unknown';
  }

  function startTreatment(visit) {
    Visits.update(visit.id, { status: 'in_progress', doctorId: user.id });
    setQueue(Visits.today());
    setSelectedVisit({ ...visit, status: 'in_progress' });
    setDiagnosis('');
    setMedicineItems([{ medicineId: '', dosage: '', quantity: 1 }]);
  }

  function addMedicineRow() {
    setMedicineItems([...medicineItems, { medicineId: '', dosage: '', quantity: 1 }]);
  }

  function updateMedicineRow(index, changes) {
    setMedicineItems(medicineItems.map((it, i) => (i === index ? { ...it, ...changes } : it)));
  }

  function completeTreatment() {
    if (!selectedVisit) return;
    Visits.update(selectedVisit.id, { status: 'completed', diagnosis });

    const validItems = medicineItems.filter((it) => it.medicineId && it.quantity > 0);
    if (validItems.length) {
      Prescriptions.add(selectedVisit.id, validItems);
    }

    // Base consultation fee
    Bills.add(selectedVisit.patientId, selectedVisit.id, [
      { type: 'service', description: 'Consultation fee', amount: 2000 },
    ]);

    setQueue(Visits.today());
    setSelectedVisit(null);
  }

  return (
    <div>
      <h2>Treatment queue</h2>

      <div className="card">
        {queue.length === 0 ? (
          <div className="empty-state">No patients in the queue today.</div>
        ) : (
          <table>
            <thead>
              <tr><th>Patient</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {queue.map((v) => (
                <tr key={v.id}>
                  <td>{getPatientName(v.patientId)}</td>
                  <td><span className={`badge ${STATUS_BADGE[v.status].className}`}>{STATUS_BADGE[v.status].label}</span></td>
                  <td>
                    {user.role === 'doctor' && v.status !== 'completed' && (
                      <button className="ghost" onClick={() => startTreatment(v)}>Start treatment</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedVisit && user.role === 'doctor' && (
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Consultation for {getPatientName(selectedVisit.patientId)}</h3>

          <label>Diagnosis and findings</label>
          <textarea rows={3} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />

          <label>Prescription</label>
          {medicineItems.map((it, i) => (
            <div className="grid-2" key={i} style={{ gridTemplateColumns: '2fr 1fr 1fr' }}>
              <select value={it.medicineId} onChange={(e) => updateMedicineRow(i, { medicineId: e.target.value })}>
                <option value="">-- select medicine --</option>
                {allMedicines.map((m) => (
                  <option key={m.id} value={m.id}>{m.name} (in stock: {m.quantityInStock})</option>
                ))}
              </select>
              <input placeholder="dosage, e.g. 1x3" value={it.dosage} onChange={(e) => updateMedicineRow(i, { dosage: e.target.value })} />
              <input type="number" min={1} value={it.quantity} onChange={(e) => updateMedicineRow(i, { quantity: Number(e.target.value) })} />
            </div>
          ))}
          <button className="ghost" type="button" onClick={addMedicineRow} style={{ marginBottom: 16 }}>
            + Add another medicine
          </button>

          <div>
            <button className="primary" onClick={completeTreatment}>Complete treatment</button>
          </div>
        </div>
      )}
    </div>
  );
}
