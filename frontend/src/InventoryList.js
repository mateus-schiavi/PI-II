import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './InventoryList.css';

const InventoryList = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '' });
  const [editItem, setEditItem] = useState(null);

  const handleEditClick = (item) => {
    setEditItem(item); // Preenche o formulário de edição com o item selecionado
  };

  const formatCurrency = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    
    const numberValue = (parseInt(cleanValue, 10) / 100).toFixed(2);
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numberValue);
  };
  
  const cleanCurrencyValue = (value) => {
    // Remove o "R$" e os separadores de milhares (pontos e vírgulas)
    return parseFloat(value.replace(/\D/g, '')) / 100;
  };

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
      setError('Erro ao deletar item');
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const cleanedPrice = cleanCurrencyValue(newItem.price);
      const response = await axios.post('http://localhost:5000/api/inventory/items', { ...newItem, price: cleanedPrice });
      setItems([...items, response.data]);
      setNewItem({ name: '', quantity: '', price: '' });
    } catch (err) {
      setError('Erro ao adicionar item');
    }
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    try {
      const cleanedPrice = cleanCurrencyValue(editItem.price);
      const response = await axios.put(`http://localhost:5000/api/inventory/items/${editItem._id}`, { ...editItem, price: cleanedPrice });
      setItems(items.map(item => (item._id === editItem._id ? response.data : item)));
      setEditItem(null);
    } catch (err) {
      setError('Erro ao editar item');
    }
  };

  return (
    <div className="container">
      <h1>Controle e Gerenciamento de Estoque</h1>
      {error && <p className="error-message">{error}</p>}

      {/* Formulário de Adicionar Produto */}
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
          type="text"
          placeholder="Preço"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: formatCurrency(e.target.value) })} 
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      {/* Lista de Produtos */}
      <h2>Lista de Produtos</h2>
      <ul>
        {items.map(item => (
          <li key={item._id} style={{ marginBottom: '20px' }}>
            <p><strong>Nome do produto:</strong> {item.name}</p>
            <p><strong>Quantidade:</strong> {item.quantity}</p>
            <p><strong>Preço:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</p>
            <div className="button-group">
              <button onClick={() => handleEditClick(item)}>Editar</button>
              <button onClick={() => handleDelete(item._id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>

      {/* Formulário de Editar Produto */}
      {editItem && (
        <div>
          <h2>Editar Produto</h2>
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
              type="text"
              placeholder="Preço"
              value={editItem.price}
              onChange={(e) => setEditItem({ ...editItem, price: formatCurrency(e.target.value) })}
              required
            />
            <button type="submit">Salvar Alterações</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default InventoryList;
