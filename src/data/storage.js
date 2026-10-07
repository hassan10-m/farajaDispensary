// storage.js
// Data layer. Every function here talks to localStorage.
// If you move to a real backend later, rewrite these functions to use
// fetch('/api/...') instead - the UI/pages won't need to change.

const KEYS = {
  users: 'dispensary_users',
  patients: 'dispensary_patients',
  visits: 'dispensary_visits',
  prescriptions: 'dispensary_prescriptions',
  medicines: 'dispensary_medicines',
  bills: 'dispensary_bills',
  session: 'dispensary_session',
};

function read(key) {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : [];
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextId(list, prefix) {
  const n = list.length + 1;
  return `${prefix}-${String(n).padStart(4, '0')}`;
}

// ---------- Users ----------
export const Users = {
  all: () => read(KEYS.users),
  findByUsername: (username) => read(KEYS.users).find((u) => u.username === username),
  usernameExists: (username) => read(KEYS.users).some((u) => u.username === username),
  add: (user) => {
    const list = read(KEYS.users);
    const created = { ...user, id: nextId(list, 'U') };
    write(KEYS.users, [...list, created]);
    return created;
  },
  remove: (id) => {
    const list = read(KEYS.users).filter((u) => u.id !== id);
    write(KEYS.users, list);
  },
};

// ---------- Session ----------
export const Session = {
  set: (user) => localStorage.setItem(KEYS.session, JSON.stringify(user)),
  get: () => {
    const raw = localStorage.getItem(KEYS.session);
    return raw ? JSON.parse(raw) : null;
  },
  clear: () => localStorage.removeItem(KEYS.session),
};

// ---------- Patients ----------
export const Patients = {
  all: () => read(KEYS.patients),
  getById: (id) => read(KEYS.patients).find((p) => p.id === id),
  search: (term) => {
    const t = term.trim().toLowerCase();
    if (!t) return read(KEYS.patients);
    return read(KEYS.patients).filter(
      (p) => p.name.toLowerCase().includes(t) || p.phone.includes(t) || p.id.toLowerCase().includes(t)
    );
  },
  phoneExists: (phone) => read(KEYS.patients).some((p) => p.phone === phone),
  add: (patient) => {
    const list = read(KEYS.patients);
    const year = new Date().getFullYear();
    const created = {
      ...patient,
      id: `FD-${year}-${String(list.length + 1).padStart(4, '0')}`,
      registeredAt: new Date().toISOString(),
    };
    write(KEYS.patients, [...list, created]);
    return created;
  },
};

// ---------- Visits ----------
export const Visits = {
  all: () => read(KEYS.visits),
  today: () => {
    const today = new Date().toISOString().slice(0, 10);
    return read(KEYS.visits).filter((v) => v.date === today);
  },
  byPatient: (patientId) => read(KEYS.visits).filter((v) => v.patientId === patientId),
  getById: (id) => read(KEYS.visits).find((v) => v.id === id),
  add: (patientId) => {
    const list = read(KEYS.visits);
    const created = {
      id: nextId(list, 'V'),
      patientId,
      date: new Date().toISOString().slice(0, 10),
      status: 'pending', // pending | in_progress | completed
      diagnosis: '',
      doctorId: null,
    };
    write(KEYS.visits, [...list, created]);
    return created;
  },
  update: (id, changes) => {
    const list = read(KEYS.visits).map((v) => (v.id === id ? { ...v, ...changes } : v));
    write(KEYS.visits, list);
    return list.find((v) => v.id === id);
  },
};

// ---------- Prescriptions ----------
export const Prescriptions = {
  all: () => read(KEYS.prescriptions),
  pending: () => read(KEYS.prescriptions).filter((p) => p.status === 'pending'),
  byVisit: (visitId) => read(KEYS.prescriptions).filter((p) => p.visitId === visitId),
  add: (visitId, items) => {
    const list = read(KEYS.prescriptions);
    const created = {
      id: nextId(list, 'RX'),
      visitId,
      items, // [{ medicineId, dosage, quantity }]
      status: 'pending', // pending | dispensed | partially_dispensed
    };
    write(KEYS.prescriptions, [...list, created]);
    return created;
  },
  updateStatus: (id, status) => {
    const list = read(KEYS.prescriptions).map((p) => (p.id === id ? { ...p, status } : p));
    write(KEYS.prescriptions, list);
  },
};

// ---------- Medicines ----------
export const Medicines = {
  all: () => read(KEYS.medicines),
  getById: (id) => read(KEYS.medicines).find((m) => m.id === id),
  lowStock: () => read(KEYS.medicines).filter((m) => m.quantityInStock <= m.lowStockThreshold),
  add: (medicine) => {
    const list = read(KEYS.medicines);
    const created = { ...medicine, id: nextId(list, 'M') };
    write(KEYS.medicines, [...list, created]);
    return created;
  },
  reduceStock: (id, quantity) => {
    const list = read(KEYS.medicines).map((m) =>
      m.id === id ? { ...m, quantityInStock: Math.max(0, m.quantityInStock - quantity) } : m
    );
    write(KEYS.medicines, list);
  },
};

// ---------- Bills ----------
export const Bills = {
  all: () => read(KEYS.bills),
  byPatient: (patientId) => read(KEYS.bills).filter((b) => b.patientId === patientId),
  add: (patientId, visitId, items) => {
    const list = read(KEYS.bills);
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    const created = {
      id: nextId(list, 'B'),
      patientId,
      visitId,
      items,
      total,
      status: 'unpaid',
    };
    write(KEYS.bills, [...list, created]);
    return created;
  },
  markPaid: (id) => {
    const list = read(KEYS.bills).map((b) => (b.id === id ? { ...b, status: 'paid' } : b));
    write(KEYS.bills, list);
  },
};

export { KEYS };
