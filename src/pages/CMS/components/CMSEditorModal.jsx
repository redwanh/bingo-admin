import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '????' },
  { code: 'am', name: '????', flag: '????' },
  { code: 'tg', name: '????', flag: '????' }
];

export default function CMSEditorModal({ item, type, onSave, onClose }) {
  const [form, setForm] = useState({
    type: type, language: 'en', title: '', content: '',
    question: '', answer: '', contactType: 'phone', label: '', value: '',
    order: 0, isActive: true
  });

  useEffect(() => {
    if (item) {
      setForm({
        type: item.type || type, language: item.language || 'en',
        title: item.title || '', content: item.content || '',
        question: item.question || '', answer: item.answer || '',
        contactType: item.contactType || 'phone', label: item.label || '',
        value: item.value || '', order: item.order || 0, isActive: item.isActive !== false
      });
    }
  }, [item, type]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (type === 'faq' && (!form.question || !form.answer)) { toast.error('Question and Answer required'); return; }
    if (type === 'contact' && (!form.label || !form.value)) { toast.error('Label and Value required'); return; }
    if (type === 'terms' && (!form.title || !form.content)) { toast.error('Title and Content required'); return; }
    onSave(form);
  };

  const s = { width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd', fontSize: 14, boxSizing: 'border-box' };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div style={{ background: '#fff', borderRadius: 12, width: '90%', maxWidth: 600, maxHeight: '90vh', overflow: 'auto', boxShadow: '0 10px 40px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #eee' }}>
          <h3 style={{ margin: 0, color: '#1a1a2e' }}>{item ? 'Edit' : 'Add'} {type === 'faq' ? 'FAQ' : type === 'contact' ? 'Contact' : 'Terms'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#666' }}>?</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: 20 }}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Language</label>
            <select value={form.language} onChange={e => setForm({...form, language: e.target.value})} style={s}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
            </select>
          </div>
          {type === 'terms' && <>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} style={s} placeholder="Enter title" /></div>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Content</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} style={{...s, minHeight: 150}} placeholder="Enter content" rows={6} /></div>
          </>}
          {type === 'faq' && <>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Question</label><input value={form.question} onChange={e => setForm({...form, question: e.target.value})} style={s} placeholder="Enter question" /></div>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Answer</label><textarea value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} style={{...s, minHeight: 100}} placeholder="Enter answer" rows={4} /></div>
          </>}
          {type === 'contact' && <>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Type</label><select value={form.contactType} onChange={e => setForm({...form, contactType: e.target.value})} style={s}><option value="phone">?? Phone</option><option value="email">?? Email</option><option value="telegram">?? Telegram</option><option value="whatsapp">?? WhatsApp</option><option value="address">?? Address</option><option value="other">?? Other</option></select></div>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Label</label><input value={form.label} onChange={e => setForm({...form, label: e.target.value})} style={s} placeholder="e.g. Customer Support" /></div>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Value</label><input value={form.value} onChange={e => setForm({...form, value: e.target.value})} style={s} placeholder="e.g. +251912345678" /></div>
          </>}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15 }}>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Order</label><input type="number" value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value) || 0})} style={s} /></div>
            <div style={{ marginBottom: 15 }}><label style={{ display: 'block', marginBottom: 5, fontSize: 13, fontWeight: 600 }}>Active</label><select value={form.isActive} onChange={e => setForm({...form, isActive: e.target.value === 'true'})} style={s}><option value="true">? Active</option><option value="false">? Inactive</option></select></div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 20px', borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer', fontSize: 14 }}>Cancel</button>
            <button type="submit" style={{ padding: '8px 20px', borderRadius: 6, border: 'none', background: '#FF4757', color: '#fff', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>{item ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
