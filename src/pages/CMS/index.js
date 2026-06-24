import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CMSEditorModal from './components/CMSEditorModal';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TABS = [{ key: 'terms', label: '?? Terms & Conditions' },{ key: 'faq', label: '? FAQ' },{ key: 'contact', label: '?? Contact Us' }];
const LANGUAGES = [{ code: 'en', name: 'English', flag: '????' },{ code: 'am', name: '????', flag: '????' },{ code: 'tg', name: '????', flag: '????' }];

export default function CMS() {
  const [activeTab, setActiveTab] = useState('terms');
  const [activeLang, setActiveLang] = useState('en');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => { fetchItems(); }, [activeTab, activeLang]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/cms/public?type=' + activeTab + '&language=' + activeLang, { headers });
      setItems(res.data.items || []);
    } catch (err) { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const handleSave = async (formData) => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      if (editingItem) { await axios.put(API + '/cms/' + editingItem._id, formData, { headers }); toast.success('Updated!'); }
      else { await axios.post(API + '/cms', formData, { headers }); toast.success('Created!'); }
      setShowModal(false); setEditingItem(null); fetchItems();
    } catch (err) { toast.error('Failed to save'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.delete(API + '/cms/' + id, { headers });
      toast.success('Deleted!'); fetchItems();
    } catch (err) { toast.error('Failed to delete'); }
  };

  const handleToggle = async (id) => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.patch(API + '/cms/' + id + '/toggle', {}, { headers });
      fetchItems();
    } catch (err) { toast.error('Failed to toggle'); }
  };

  return (
    <div style={{ padding: 20, background: '#f5f6fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ margin: 0, color: '#1a1a2e' }}>?? Content Management</h2>
        <button onClick={() => { setEditingItem(null); setShowModal(true); }} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#FF4757', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>+ Add New</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 15 }}>
        {LANGUAGES.map(l => (
          <button key={l.code} onClick={() => setActiveLang(l.code)} style={{ padding: '6px 16px', borderRadius: 20, border: activeLang === l.code ? 'none' : '1px solid #ddd', background: activeLang === l.code ? '#FF4757' : '#fff', color: activeLang === l.code ? '#fff' : '#333', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>{l.flag} {l.name}</button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', borderRadius: 10, padding: 4 }}>
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, background: activeTab === tab.key ? '#FF4757' : 'transparent', color: activeTab === tab.key ? '#fff' : '#666' }}>{tab.label}</button>
        ))}
      </div>
      {loading ? <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading...</div> :
       items.length === 0 ? <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12 }}><p style={{ fontSize: 40, margin: '0 0 10px' }}>??</p><p style={{ color: '#888' }}>No {activeTab} found</p><button onClick={() => { setEditingItem(null); setShowModal(true); }} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: '#FF4757', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginTop: 10 }}>Create First One</button></div> :
       <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => (
          <div key={item._id} style={{ background: '#fff', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 15, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #f0f0f0' }}>
            <div style={{ flex: 1 }}>
              {activeTab === 'terms' && <><div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{item.title}</div><div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{item.content?.substring(0, 150)}{item.content?.length > 150 ? '...' : ''}</div></>}
              {activeTab === 'faq' && <><div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>Q: {item.question}</div><div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>A: {item.answer?.substring(0, 150)}{item.answer?.length > 150 ? '...' : ''}</div></>}
              {activeTab === 'contact' && <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ fontSize: 20 }}>{item.contactType === 'phone' ? '??' : item.contactType === 'email' ? '??' : item.contactType === 'telegram' ? '??' : '??'}</span><div><div style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</div><div style={{ fontSize: 13, color: '#FF4757' }}>{item.value}</div></div></div>}
              <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: '#999' }}><span>Order: {item.order}</span><span style={{ color: item.isActive ? '#2ed573' : '#ff4757' }}>{item.isActive ? '?? Active' : '?? Inactive'}</span></div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleToggle(item._id)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>{item.isActive ? '???' : '???????'}</button>
              <button onClick={() => { setEditingItem(item); setShowModal(true); }} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>??</button>
              <button onClick={() => handleDelete(item._id)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#ff4757' }}>???</button>
            </div>
          </div>
        ))}
      </div>}
      {showModal && <CMSEditorModal item={editingItem} type={activeTab} onSave={handleSave} onClose={() => { setShowModal(false); setEditingItem(null); }} />}
    </div>
  );
}


