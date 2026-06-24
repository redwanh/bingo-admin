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
  requiredCombination: { rows: null, columns: null, diagonals: null },
  mustHaveAllTypes: false, exclusiveLines: null,
  linesMustIntersect: false, linesMustNotIntersect: false,
  intersectionPoint: { row: 2, col: 2 },
  freeSpaceCounts: true, freeSpaceRequiredForWin: false,
  freeSpaceBlocked: false, freeSpaceCountsForLines: true,
  allowOverlapping: true, requireUniqueLines: false,
  sharedCellsLimit: null,
  lineDirections: ['horizontal', 'vertical', 'diagonal'],
  requiredDirections: [], prohibitedDirections: [],
  cornersRequired: false, minCellsMarked: null,
  specificLines: {
    topRow: false, bottomRow: false, leftColumn: false, rightColumn: false,
    centerRow: false, centerColumn: false, mainDiagonal: false, antiDiagonal: false
  }
};

const defaultForm = {
  name: '', description: '', method: 'rule',
  ruleConfig: { ...defaultRuleConfig },
  patterns: []
};

export default function MainBingoRulesPage() {
  const { user } = useAuth();
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [form, setForm] = useState({ ...defaultForm });
  
  // Test state
  const [testRule, setTestRule] = useState(null);
  const [testCells, setTestCells] = useState([]);
  const [testResult, setTestResult] = useState(null);
  
  // Samples state
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

  // ============================================
  // CRUD OPERATIONS
  // ============================================
  const openCreate = () => {
    setEditingRule(null);
    setForm({ ...defaultForm, ruleConfig: { ...defaultRuleConfig } });
    setShowModal(true);
  };

  const openEdit = (rule) => {
    setEditingRule(rule);
    setForm({
      name: rule.name,
      description: rule.description || '',
      method: rule.method,
      ruleConfig: { ...defaultRuleConfig, ...rule.ruleConfig },
      patterns: rule.patterns || []
    });
    setShowModal(true);
  };

  const saveRule = async () => {
    try {
      if (editingRule) {
        await axios.put(API + '/main-bingo-rules/' + editingRule._id, form, { headers: headers() });
        toast.success('Rule updated!');
      } else {
        await axios.post(API + '/main-bingo-rules', form, { headers: headers() });
        toast.success('Rule created!');
      }
      setShowModal(false);
      fetchRules();
    } catch (e) { toast.error(e.response?.data?.error || 'Save failed'); }
  };

  const deleteRule = async (id) => {
    if (!window.confirm('Delete this rule?')) return;
    try {
      await axios.delete(API + '/main-bingo-rules/' + id, { headers: headers() });
      toast.success('Deleted!');
      fetchRules();
    } catch { toast.error('Delete failed'); }
  };

  // ============================================
  // TEST OPERATIONS
  // ============================================
  const openTest = (rule) => {
    setTestRule(rule);
    setTestCells([]);
    setTestResult(null);
  };
  const deleteSample = async (type, index) => {
    if (!window.confirm('Delete this sample?')) return;
    try {
      await axios.delete(
        API + '/main-bingo-rules/' + viewRule._id + '/samples/' + type + '/' + index,
        { headers: headers() }
      );
      toast.success('Sample deleted!');
      // Refresh samples
      const res = await axios.get(API + '/main-bingo-rules/' + viewRule._id + '/samples', { headers: headers() });
      setSamples(res.data.samples || { wins: [], losses: [] });
    } catch { toast.error('Failed to delete'); }
  };

  const toggleTestCell = (row, col) => {
    setTestCells(prev => {
      const exists = prev.find(c => c[0] === row && c[1] === col);
      if (exists) return prev.filter(c => !(c[0] === row && c[1] === col));
      return [...prev, [row, col]];
    });
    setTestResult(null);
  };

  const runTest = async () => {
    if (!testRule || testCells.length === 0) {
      toast.error('Please mark some cells first');
      return;
    }
    try {
      const res = await axios.post(
        API + '/main-bingo-rules/' + testRule._id + '/test',
        { markedCells: testCells },
        { headers: headers() }
      );
      setTestResult(res.data.result);
    } catch { toast.error('Test failed'); }
  };

  const saveAsSample = async (type) => {
    if (!testResult) return;
    try {
      await axios.post(
        API + '/main-bingo-rules/' + testRule._id + '/samples',
        {
          type,
          sample: {
            markedCells: testCells,
            isValid: testResult.valid,
            details: testResult.details || {}
          }
        },
        { headers: headers() }
      );
      toast.success(`Saved as ${type} sample! 🎉`);
      fetchRules();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to save sample');
    }
  };

  // ============================================
  // SAMPLES OPERATIONS
  // ============================================
  const openSamples = async (rule) => {
    setViewRule(rule);
    try {
      const res = await axios.get(
        API + '/main-bingo-rules/' + rule._id + '/samples',
        { headers: headers() }
      );
      setSamples(res.data.samples || { wins: [], losses: [] });
    } catch {
      setSamples({ wins: [], losses: [] });
      toast.error('Failed to load samples');
    }
    setShowSamples(true);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 50 }}>
      <div style={{ fontSize: 24, marginBottom: 10 }}>🎯</div>
      <p style={{ color: '#888' }}>Loading rules...</p>
    </div>
  );

  return (
    <>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>🎯 Main Bingo Rules</h1>
          <p style={{ color: '#888', fontSize: 13, margin: '4px 0 0 0' }}>
            Manage winning conditions and test them
          </p>
        </div>
        <button onClick={openCreate} style={{ 
          padding: '12px 28px', background: '#FF4757', color: '#fff', border: 'none', 
          borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14,
          boxShadow: '0 4px 15px rgba(255,71,87,0.3)'
        }}>
          + Create New Rule
        </button>
      </div>

       <div style={{ 
        background: '#0a0a1e', padding: 24, borderRadius: 16, 
        marginBottom: 24, border: '1px solid #1a1a3e' 
      }}>
        <ScheduledGames />
      </div>

      {/* Rules Grid */}
      {rules.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, background: '#16213e', borderRadius: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎱</div>
          <p style={{ color: '#888', fontSize: 16 }}>No rules yet. Create your first rule!</p>
        </div>
      )}
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 20 }}>
        {rules.map(rule => (
          <RuleCard
            key={rule._id}
            rule={rule}
            onEdit={() => openEdit(rule)}
            onTest={() => openTest(rule)}
            onSamples={() => openSamples(rule)}
            onDelete={() => deleteRule(rule._id)}
          />
        ))}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <RuleForm
          editingRule={editingRule}
          form={form}
          onChange={setForm}
          onSave={saveRule}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Test Modal */}
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

      {/* Samples Modal */}
      {showSamples && viewRule && (
        <SamplesModal
          rule={viewRule}
          samples={samples}
          onClose={() => setShowSamples(false)}
          onDeleteSample={deleteSample} 
        />
      )}
    </>
  );
}