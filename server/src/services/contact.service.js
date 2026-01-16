import Contact from '../models/contact.model.js';

export const createContact = async (data) => {
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
