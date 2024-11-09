import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import axios from 'axios';
import './InventoryList.css';

ReactModal.setAppElement('#root');

const InventoryList = ({onLogout}) => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '' });
  const [editItem, setEditItem] = useState(null);
  const [sellingItem, setSellingItem] = useState(null);
  const [saleQuantity, setSaleQuantity] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const handleEditClick = (item) => {
    setEditItem({ ...item, price: item.price.toString() });
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditItem(null);
    setIsEditModalOpen(false);
  };

  const handleNewItemPriceChange = (e) => {
    const value = e.target.value;
    setNewItem({ ...newItem, price: value });
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    const numberValue = parseFloat(value).toFixed(2);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numberValue);
  };

  const cleanCurrencyValue = (value) => {
    if (!value) return 0;
    const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/inventory/items');
        console.log('Resposta da API:', response.data);
        setItems(response.data);
      } catch (err) {
        // Log do erro detalhado
        console.error('Erro ao buscar itens:', err.response ? err.response.data : err.message);
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
      const updatedItem = {
        name: editItem.name,
        quantity: editItem.quantity,
        price: cleanedPrice,
      };

      const response = await axios.put(`http://localhost:5000/api/inventory/items/${editItem._id}`, updatedItem);
      setItems(items.map(item => (item._id === editItem._id ? response.data : item)));
      setEditItem(null);
      setIsEditModalOpen(false);
    } catch (err) {
      setError('Erro ao editar item');
    }
  };

  const handleSellClick = (item) => {
    setSellingItem(item);
    setSaleQuantity('');
    setIsSaleModalOpen(true);
  };

  const handleSaveSale = async () => {
    if (parseInt(saleQuantity) > sellingItem.quantity) {
      setError('Quantidade de venda excede o estoque');
      return;
    }

    const updatedQuantity = sellingItem.quantity - parseInt(saleQuantity);
    try {
      const response = await axios.put(`http://localhost:5000/api/inventory/items/${sellingItem._id}`, { ...sellingItem, quantity: updatedQuantity });
      setItems(items.map(i => (i._id === sellingItem._id ? response.data : i)));
      setSellingItem(null);
      setSaleQuantity('');
      setError('');
      setIsSaleModalOpen(false);
    } catch (err) {
      setError('Erro ao salvar venda');
    }
  };

  const handleCancelSale = () => {
    setSellingItem(null);
    setSaleQuantity('');
    setIsSaleModalOpen(false);
  };

  return (
    <div className="container">
      <h1>Controle e Gerenciamento de Estoque</h1>
      {error && <p className="error-message">{error}</p>}

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
          type="text"
          placeholder="Preço"
          value={newItem.price}
          onChange={handleNewItemPriceChange}
          required
        />
        <input
          type="number"
          placeholder="Quantidade"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
          required
        />
        <button type="submit">Adicionar</button>
      </form>

      <h2>Lista de Produtos</h2>
      <button onClick={onLogout}>Logout</button>
      <ul>
        {items.map(item => (
          <li key={item._id} style={{ marginBottom: '20px' }}>
            <p name="item-info"><strong>Nome do produto:</strong> {item.name}</p>
            <p name="item-info"><strong>Estoque:</strong> {item.quantity}</p>
            <p name="item-info"><strong>Preço:</strong> {formatCurrency(item.price)}</p>
            <div className="button-group">
              <button onClick={() => handleSellClick(item)}>Vender</button>
              <button onClick={() => handleEditClick(item)}>Editar</button>
              <button onClick={() => handleDelete(item._id)}>Excluir</button>
            </div>
          </li>
        ))}
      </ul>

      <ReactModal
        isOpen={isSaleModalOpen}
        onRequestClose={handleCancelSale}
        contentLabel="Venda do Produto"
      >
        <h2>Venda do Produto</h2>
        <form className="sale" onSubmit={(e) => { e.preventDefault(); handleSaveSale(); }}>
          <input
            type="number"
            placeholder="Quantidade vendida"
            value={saleQuantity}
            onChange={(e) => setSaleQuantity(e.target.value)}
            required
          />
          <div className="button-group">
            <button type="submit">Salvar</button>
            <button type="button" onClick={handleCancelSale}>Cancelar</button>
          </div>
        </form>
      </ReactModal>

      <ReactModal
        isOpen={isEditModalOpen}
        onRequestClose={handleCancelEdit}
        contentLabel="Editar Produto"
      >
        <h2>Editar Produto</h2>
        <form onSubmit={handleEditItem}>
          <input
            type="text"
            placeholder="Nome do produto"
            value={editItem?.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Preço"
            value={editItem?.price}
            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={editItem?.quantity}
            onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
            required
          />
          <div className="button-group">
            <button type="submit">Salvar</button>
            <button type="button" onClick={handleCancelEdit}>Cancelar</button>
          </div>
        </form>
      </ReactModal>
    </div>
  );
};

export default InventoryList;
