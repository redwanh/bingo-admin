import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import RuleCard from '../components/bingo/RuleCard';
import RuleForm from '../components/bingo/RuleForm';
import TestModal from '../components/bingo/TestModal';
import SamplesModal from '../components/bingo/SamplesModal';
import ScheduledGames from '../components/bingo/ScheduledGames';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const defaultRuleConfig = {
  linesToWin: 1, minRows: 0, minColumns: 0, minDiagonals: 0,
  exactRows: null, exactColumns: null, exactDiagonals: null,
  maxRows: null, maxColumns: null, maxDiagonals: null,
  minSquares: 0, exactSquares: null, maxSquares: null, squareSize: 2,
  minRectangles: 0, exactRectangles: null, maxRectangles: null, rectWidth: 3, rectHeight: 2,
  requiredCombination: { rows: null, columns: null, diagonals: null, squares: null, rectangles: null },
  mustHaveAllTypes: false, exclusiveLines: null,
  linesMustIntersect: false, linesMustNotIntersect: false,
  intersectionPoint: { row: 2, col: 2 },
  freeSpaceCounts: true, freeSpaceRequiredForWin: false, freeSpaceBlocked: false,
  allowOverlapping: true, requireUniqueLines: false, sharedCellsLimit: null,
  lineDirections: ['horizontal', 'vertical', 'diagonal', 'square', 'rectangle'],
  requiredDirections: [], prohibitedDirections: [],
  cornersRequired: 0, minCellsMarked: null,
  specificLines: { topRow: false, bottomRow: false, leftColumn: false, rightColumn: false, centerRow: false, centerColumn: false, mainDiagonal: false, antiDiagonal: false }
};

const defaultMixedSubRule = {
  type: 'count',
  countConfig: {
    linesToWin: 1, minRows: 0, minColumns: 0, minDiagonals: 0,
    minSquares: 0, minRectangles: 0,
    squareSize: 2, rectWidth: 3, rectHeight: 2,
    lineDirections: ['horizontal', 'vertical', 'diagonal'],
    allowOverlapping: true, freeSpaceCounts: true, cornersRequired: 0,
  },
  patternIndex: 0,
  interception: 'canIntercept',
};

const defaultForm = {
  name: '', description: '', method: 'rule',
  ruleConfig: { ...defaultRuleConfig },
  patterns: [],
  mixedRules: [],
  nameAmharic: '', nameTigrinya: '', nameOromo: '', nameChinese: '', nameEnglish: '',
  descriptionAmharic: '', descriptionTigrinya: '', descriptionOromo: '', descriptionChinese: '', descriptionEnglish: '',
};

export default function MainBingoRulesPage() {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  const [testRule, setTestRule] = useState(null);
  const [testCells, setTestCells] = useState([]);
  const [testResult, setTestResult] = useState(null);
  const [showSamples, setShowSamples] = useState(false);
  const [viewRule, setViewRule] = useState(null);
  const [samples, setSamples] = useState({ wins: [], losses: [] });

  useEffect(() => { fetchRules(); }, []);

  const headers = () => ({ Authorization: 'Bearer ' + localStorage.getItem('token') });

  const fetchRules = async () => {
    try {
      const res = await axios.get(API + '/main-bingo-rules', { headers: headers() });
      setRules(res.data.rules || []);
    } catch { toast.error('Failed to load rules'); }
    setLoading(false);
  };

  const openCreate = () => {
    setEditingRule(null);
    setForm({ 
      ...defaultForm, 
      ruleConfig: { ...defaultRuleConfig },
      patterns: [],
      mixedRules: [],
    });
    setShowModal(true);
  };

  const openEdit = (rule) => {
    setEditingRule(rule);
    setForm({
      name: rule.name || '',
      description: rule.description || '',
      method: rule.method || 'rule',
      ruleConfig: { ...defaultRuleConfig, ...(rule.ruleConfig || {}) },
      patterns: rule.patterns || [],
      mixedRules: rule.mixedRules || [],
      nameAmharic: rule.nameAmharic || '', nameTigrinya: rule.nameTigrinya || '',
      nameOromo: rule.nameOromo || '', nameChinese: rule.nameChinese || '', nameEnglish: rule.nameEnglish || '',
      descriptionAmharic: rule.descriptionAmharic || '', descriptionTigrinya: rule.descriptionTigrinya || '',
      descriptionOromo: rule.descriptionOromo || '', descriptionChinese: rule.descriptionChinese || '', descriptionEnglish: rule.descriptionEnglish || '',
    });
    setShowModal(true);
  };

  const saveRule = async () => {
    try {
      // 🔧 Ensure name is set
      const data = {
        ...form,
        name: form.name?.trim() || form.nameEnglish?.trim() || form.nameAmharic?.trim() || 'Untitled Rule',
        description: form.description?.trim() || form.descriptionEnglish?.trim() || '',
      };

      console.log('📤 Saving rule:', {
        name: data.name,
        method: data.method,
        patternsCount: data.patterns?.length,
        mixedRulesCount: data.mixedRules?.length,
      });

      if (editingRule) {
        await axios.put(API + '/main-bingo-rules/' + editingRule._id, data, { headers: headers() });
        toast.success('Rule updated!');
      } else {
        await axios.post(API + '/main-bingo-rules', data, { headers: headers() });
        toast.success('Rule created!');
      }
      setShowModal(false);
      fetchRules();
    } catch (e) { 
      console.error('Save error:', e.response?.data);
      toast.error(e.response?.data?.error || 'Save failed'); 
    }
  };

  const deleteRule = async (id) => {
    if (!window.confirm('Delete this rule?')) return;
    try {
      await axios.delete(API + '/main-bingo-rules/' + id, { headers: headers() });
      toast.success('Deleted!'); fetchRules();
    } catch { toast.error('Delete failed'); }
  };

  const openTest = (rule) => { setTestRule(rule); setTestCells([]); setTestResult(null); };

  const deleteSample = async (type, index) => {
    if (!window.confirm('Delete this sample?')) return;
    try {
      await axios.delete(API + '/main-bingo-rules/' + viewRule._id + '/samples/' + type + '/' + index, { headers: headers() });
      toast.success('Sample deleted!');
      const res = await axios.get(API + '/main-bingo-rules/' + viewRule._id + '/samples', { headers: headers() });
      setSamples(res.data.samples || { wins: [], losses: [] });
    } catch { toast.error('Failed to delete'); }
  };

  const toggleTestCell = (row, col) => {
    setTestCells(prev => {
      const exists = prev.find(c => c[0] === row && c[1] === col);
      return exists ? prev.filter(c => !(c[0] === row && c[1] === col)) : [...prev, [row, col]];
    });
    setTestResult(null);
  };

  const runTest = async () => {
    if (!testRule || testCells.length === 0) { toast.error('Please mark some cells first'); return; }
    try {
      const res = await axios.post(API + '/main-bingo-rules/' + testRule._id + '/test', { markedCells: testCells }, { headers: headers() });
      setTestResult(res.data.result);
    } catch { toast.error('Test failed'); }
  };

  const saveAsSample = async (type) => {
    if (!testResult) return;
    try {
      await axios.post(API + '/main-bingo-rules/' + testRule._id + '/samples', { type, sample: { markedCells: testCells, isValid: testResult.valid, details: testResult.details || {} } }, { headers: headers() });
      toast.success(`Saved as ${type} sample! 🎉`); fetchRules();
    } catch (e) { toast.error(e.response?.data?.error || 'Failed to save sample'); }
  };

  const openSamples = async (rule) => {
    setViewRule(rule);
    try {
      const res = await axios.get(API + '/main-bingo-rules/' + rule._id + '/samples', { headers: headers() });
      setSamples(res.data.samples || { wins: [], losses: [] });
    } catch { setSamples({ wins: [], losses: [] }); toast.error('Failed to load samples'); }
    setShowSamples(true);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80, color: '#1a1a1a', fontSize: 18, fontWeight: 600 }}>⏳ Loading...</div>;

  return (
    <div style={{ padding: '4px 0', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a2e', margin: 0 }}>🎯 Main Bingo Rules</h1>
          <p style={{ fontSize: 14, color: '#6b7280', margin: '4px 0 0' }}>Manage winning conditions and test them</p>
        </div>
        <button onClick={openCreate} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #d4af37, #b8962f)', color: '#fff', border: '2px solid #000', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>+ Create New Rule</button>
      </div>

      {rules.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, background: '#fff', border: '2px solid #000', borderRadius: 14 }}>
          <p style={{ fontSize: 48 }}>🎱</p>
          <p style={{ color: '#6b7280', fontSize: 16 }}>No rules yet. Create your first rule!</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {rules.map(rule => (
          <RuleCard key={rule._id} rule={rule} onEdit={() => openEdit(rule)} onTest={() => openTest(rule)} onSamples={() => openSamples(rule)} onDelete={() => deleteRule(rule._id)} />
        ))}
      </div>

      {showModal && (
        <RuleForm 
          editingRule={editingRule} 
          form={form} 
          onChange={setForm} 
          onSave={saveRule} 
          onClose={() => setShowModal(false)} 
        />
      )}
      
      {testRule && (
        <TestModal 
          rule={testRule} 
          testCells={testCells} 
          testResult={testResult} 
          onCellClick={toggleTestCell} 
          onTest={runTest} 
          onSaveSample={saveAsSample} 
          onClose={() => setTestRule(null)} 
        />
      )}
      
      {showSamples && viewRule && (
        <SamplesModal 
          rule={viewRule} 
          samples={samples} 
          onClose={() => setShowSamples(false)} 
          onDeleteSample={deleteSample} 
        />
      )}
    </div>
  );
}