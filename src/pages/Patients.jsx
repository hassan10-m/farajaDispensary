import React, { useState } from 'react';
import { Patients, Visits } from '../data/storage.js';
import { useNavigate } from 'react-router-dom';

const EMPTY_FORM = {
  name: '',
  dateOfBirth: '',
  gender: 'M',
  phone: '',
  address: '',
  emergencyContact: '',
};

export default function PatientsPage() {
  const [list, setList] = useState(Patients.all());
  const [term, setTerm] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [duplicateMatch, setDuplicateMatch] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    const value = e.target.value;
    setTerm(value);
    setList(Patients.search(value));
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone number is required';
    return errs;
  }

  function handleSave(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    if (Patients.phoneExists(form.phone) && !duplicateMatch) {
      setDuplicateMatch(Patients.all().find((p) => p.phone === form.phone));
      return;
    }
    const created = Patients.add(form);
    setList(Patients.all());
    setForm(EMPTY_FORM);
    setErrors({});
    setDuplicateMatch(null);
    setShowForm(false);
    addToQueue(created.id);
  }

  function addToQueue(patientId) {
    Visits.add(patientId);
    navigate('/queue');
  }

  return (
    <div>
      <h2>Patients</h2>

      <div className="card">
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: showForm ? 16 : 0 }}>
          <input
            placeholder="Search by name, phone or patient ID"
            value={term}
            onChange={handleSearch}
            style={{ marginBottom: 0 }}
          />
          <button className="primary" onClick={() => setShowForm((v) => !v)}>
            {showForm ? 'Close' : 'Register patient'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSave}>
            <div className="grid-2">
              <div>
                <label>Full name</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                {errors.name && <p className="error-text">{errors.name}</p>}
              </div>
              <div>
                <label>Date of birth</label>
                <input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              </div>
              <div>
                <label>Gender</label>
                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div>
                <label>Phone number</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
              <div>
                <label>Address</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <label>Emergency contact</label>
                <input value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })} />
              </div>
            </div>

            {duplicateMatch && (
              <div className="hint-box" style={{ marginBottom: 14 }}>
                This phone number is already registered to <strong>{duplicateMatch.name}</strong> ({duplicateMatch.id}).
                Click &quot;Save&quot; again to confirm you still want to register a new patient, or change the phone number.
              </div>
            )}

            <button className="primary" type="submit">Save</button>
          </form>
        )}
      </div>

      <div className="card">
        {list.length === 0 ? (
          <div className="empty-state">No patients found.</div>
        ) : (
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Phone</th><th>Gender</th><th></th></tr>
            </thead>
            <tbody>
              {list.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.phone}</td>
                  <td>{p.gender === 'M' ? 'Male' : 'Female'}</td>
                  <td>
                    <button className="ghost" onClick={() => addToQueue(p.id)}>Add to queue</button>
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
