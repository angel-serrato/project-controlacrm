import Contact from '../models/contact.model.js';
import User from '../models/user.model.js';

export const createContact = async (data) => {
  // RN-07: Validate assigned user is active and has sales role
  const assignedUser = await User.findById(data.assignedTo);
  if (!assignedUser || !assignedUser.active || assignedUser.role !== 'sales') {
    const err = new Error('El contacto debe asignarse a un usuario "sales" activo');
    err.status = 400;
    throw err;
  }

  // RN-04: Force initial status to NEW
  data.status = 'NEW';

  const contact = await Contact.create(data);
  return contact;
};

export const getContacts = async (filters = {}) => {
  const query = { active: true, ...filters };
  const contacts = await Contact.find(query).populate(
    'assignedTo',
    'email role'
  );
  return contacts;
};

export const getContactById = async (id) => {
  const contact = await Contact.findById(id).populate(
    'assignedTo',
    'email role'
  );
  if (!contact || !contact.active) {
    const err = new Error('Contacto no encontrado');
    err.status = 404;
    throw err;
  }
  return contact;
};

export const updateContact = async (id, data) => {
  // RN-07: Use same validation if assignedTo is being changed
  if (data.assignedTo) {
    const assignedUser = await User.findById(data.assignedTo);
    if (!assignedUser || !assignedUser.active || assignedUser.role !== 'sales') {
      const err = new Error('El contacto debe asignarse a un usuario "sales" activo');
      err.status = 400;
      throw err;
    }
  }

  const contact = await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate('assignedTo', 'email role');

  if (!contact) {
    const err = new Error('Contacto no encontrado');
    err.status = 404;
    throw err;
  }
  return contact;
};

export const deleteContact = async (id) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );

  if (!contact) {
    const err = new Error('Contacto no encontrado');
    err.status = 404;
    throw err;
  }
  return contact;
};

export const updateContactStatus = async (id, status) => {
  const validStatuses = ['NEW', 'IN_PROGRESS', 'CONTACTED', 'CLOSED'];
  if (!validStatuses.includes(status)) {
    const err = new Error('Estado inválido');
    err.status = 400;
    throw err;
  }

  const contact = await Contact.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  ).populate('assignedTo', 'email role');

  if (!contact || !contact.active) {
    const err = new Error('Contacto no encontrado');
    err.status = 404;
    throw err;
  }
  return contact;
};
