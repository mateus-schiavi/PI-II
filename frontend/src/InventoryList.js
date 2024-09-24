import React, { useEffect, useState } from 'react';
import axios from 'axios';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '' });
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventory/items');
        setItems(response.data);
      } catch (err) {
        setError('Erro ao buscar itens');
      }
    };

    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/inventory/items/${id}`);
      setItems(items.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
      setError('Erro ao deletar item');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/inventory/items', newItem);
      setItems([...items, response.data]);
      setNewItem({ name: '', quantity: '', price: '' });
    } catch (err) {
      setError('Erro ao adicionar item');
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/inventory/items/${editItem._id}`, editItem);
      setItems(items.map(item => (item._id === editItem._id ? response.data : item)));
      setEditItem(null);
    } catch (err) {
      setError('Erro ao editar item');
    }
  };

  return (
    <div>
      <h1>Controle e Gerenciamento de Estoque</h1>
      {error && <p>{error}</p>}
      
      <h2>Adicionar Produto</h2>
      <form onSubmit={handleAddItem}>
        <input
          type="text"
          placeholder="Nome"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Preço"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <h2>Lista de Produtos</h2>
      <ul>
        {items.map(item => (
          <li key={item._id}>
            {item.name} - {item.quantity} - {item.price}
            <button onClick={() => { setEditItem(item); setNewItem({ name: item.name, quantity: item.quantity, price: item.price }); }}>Editar</button>
            <button onClick={() => handleDelete(item._id)}>Excluir</button>
          </li>
        ))}
      </ul>

      {editItem && (
        <div>
          <h2>Editar Item</h2>
          <form onSubmit={handleEditItem}>
            <input
              type="text"
              placeholder="Nome"
              value={editItem.name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Quantidade"
              value={editItem.quantity}
              onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Preço"
              value={editItem.price}
              onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
              required
            />
            <button type="submit">Salvar</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
