const Client = require('../models/Client');

// GET /api/clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/clients
const createClient = async (req, res) => {
  const { name, email, phone, company } = req.body;
  if (!name) return res.status(400).json({ message: 'Client name is required' });

  try {
    const client = await Client.create({ userId: req.userId, name, email, phone, company });
    res.status(201).json(client);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/clients/:id
const updateClient = async (req, res) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, userId: req.userId });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const { name, email, phone, company } = req.body;
    if (name) client.name = name;
    if (email !== undefined) client.email = email;
    if (phone !== undefined) client.phone = phone;
    if (company !== undefined) client.company = company;

    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/clients/:id
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getClients, createClient, updateClient, deleteClient };