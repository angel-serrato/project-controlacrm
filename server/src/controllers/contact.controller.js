import * as contactService from '../services/contact.service.js';

export const createContact = async (req, res, next) => {
  try {
    const contact = await contactService.createContact(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: 'Contacto creado exitosamente',
        data: contact,
      });
  } catch (err) {
    next(err);
  }
};

export const getContacts = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filters = status ? { status } : {};
    const contacts = await contactService.getContacts(filters);
    res.json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
};

export const getContactById = async (req, res, next) => {
  try {
    const contact = await contactService.getContactById(req.params.id);
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const contact = await contactService.updateContact(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Contacto actualizado exitosamente',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const contact = await contactService.deleteContact(req.params.id);
    res.json({
      success: true,
      message: 'Contacto eliminado exitosamente',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await contactService.updateContactStatus(
      req.params.id,
      status
    );
    res.json({
      success: true,
      message: 'Estado del contacto actualizado',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
