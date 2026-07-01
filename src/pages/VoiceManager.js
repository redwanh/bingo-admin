import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const LETTERS = { B:[1,15], I:[16,30], N:[31,45], G:[46,60], O:[61,75] };
const COLORS = { B:'#FF4757', I:'#FFA502', N:'#2ED573', G:'#FF6348', O:'#7C5CFC' };

export default function VoiceManager() {
  const { user } = useAuth();
  const [voices, setVoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [recording, setRecording] = useState(null);
  const [saving, setSaving] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(new Audio());

  useEffect(() => { fetchVoices(); }, []);

  const fetchVoices = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      const res = await axios.get(API + '/voice', { headers });
      setVoices(res.data.voices || []);
    } catch (e) { toast.error('Failed to load'); }
    setLoading(false);
  };

  const initVoices = async () => {
    try {
      const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
      await axios.post(API + '/voice/init', {}, { headers });
      toast.success('75 slots created!');
      fetchVoices();
    } catch { toast.error('Failed'); }
  };
  const generateAllTTS = async () => {
  const confirmed = window.confirm('Generate spoken audio for all 75 numbers? Takes ~2 minutes.');
  if (!confirmed) return;
  try {
    const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
    toast.success('Generating 75 TTS voices... please wait');
    await axios.post(API + '/voice/generate-all', {}, { headers });
    toast.success('All TTS voices generated!');
    fetchVoices();
  } catch (e) {
    toast.error('Generation failed');
  }
};

  const startRecording = async (number, letter) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size > 0) audioChunksRef.current.push(event.data); };
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          setSaving(true);
          try {
            const headers = { Authorization: 'Bearer ' + localStorage.getItem('token') };
            await axios.put(API + '/voice/' + number, { label: letter + '-' + number, audioData: reader.result }, { headers });
            toast.success('Voice recorded & saved!');
            setEditing(null); setRecording(null); fetchVoices();
          } catch (e) { toast.error('Save failed'); }
          setSaving(false);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorder.start();
      setRecording(number);
      toast.success('Recording... click stop when done');
      setTimeout(() => { if (mediaRecorderRef.current?.state === 'recording') { mediaRecorderRef.current.stop(); toast.success('Recording stopped'); } }, 5000);
    } catch (e) { toast.error('Microphone access denied'); }
  };

  const stopRecording = () => { if (mediaRecorderRef.current?.state === 'recording') { mediaRecorderRef.current.stop(); } };
  const speakTTS = (letter, number) => { if (window.speechSynthesis) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(letter + ' ' + number); u.volume = 0.8; u.rate = 0.9; window.speechSynthesis.speak(u); } };

 const playVoice = async (number, letter) => {
  const voice = voices.find(v => v.number === number);
  
  if (voice?.audioData) {
    audioRef.current.src = voice.audioData;
    audioRef.current.play().catch(() => {});
  } else if (voice?.audioUrl) {
    audioRef.current.src = API.replace('/api', '') + voice.audioUrl;
    audioRef.current.play().catch(() => {});
  } else {
    // Fallback — should not happen after generation
    speakTTS(letter, number);
  }
  
  setPlaying(number);
  setTimeout(() => setPlaying(null), 2000);
};
  if (loading) return <div style={{ textAlign:'center',padding:50 }}>Loading...</div>;

  return (
    <>
      <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10 }}>
        <h1>🔊 Voice Manager</h1>
        <button onClick={initVoices} style={{ padding:'10px 20px',background:'#FF4757',color:'#fff',border:'none',borderRadius:8,cursor:'pointer',fontWeight:700 }}>Init 75 Slots</button>
      <button 
  onClick={generateAllTTS} 
  style={{ 
    padding:'10px 20px', background:'#007AFF', color:'#fff',
    border:'none', borderRadius:8, cursor:'pointer', fontWeight:700,
    marginLeft: 10 
  }}
>
  🔊 Generate All TTS
</button>
      </div>
      <p style={{ color:'#888',fontSize:12,marginBottom:20 }}>🎙️ Click <b style={{ color:'#FF4757' }}>REC</b> to record, speak the number, click <b style={{ color:'#2ED573' }}>STOP</b> to save. Max 5 seconds.</p>

      {voices.length === 0 && <div style={{ textAlign:'center',padding:50,color:'#888' }}><p>Click "Init 75 Slots" to create voice slots</p></div>}

      {Object.entries(LETTERS).map(([letter, [min, max]]) => (
        <div key={letter} style={{ marginBottom:25 }}>
          <h3 style={{ color:COLORS[letter],marginBottom:12,fontSize:18 }}>{letter} ({min}-{max})</h3>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:8 }}>
            {Array.from({length:max-min+1},(_,i)=>min+i).map(n => {
              const voice = voices.find(v => v.number === n);
              const isRecording = recording === n;
              const isPlaying = playing === n;
              const hasCustomVoice = voice?.audioData || voice?.audioUrl;
              return (
                <div key={n} style={{ background:'#16213e',padding:12,borderRadius:10,display:'flex',alignItems:'center',gap:8,border:isRecording?'2px solid #FF4757':hasCustomVoice?'1px solid #2ED573':'1px solid transparent' }}>
                  <button onClick={() => playVoice(n, letter)} style={{ width:36,height:36,borderRadius:'50%',border:'none',background:isPlaying?COLORS[letter]:hasCustomVoice?'#2ED573':'#0f3460',color:'#fff',cursor:'pointer',fontSize:14,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{isPlaying ? '🔊' : '▶'}</button>
                  <div style={{ flex:1,minWidth:0 }}>
                    <span style={{ fontWeight:700,fontSize:13,color:COLORS[letter] }}>{letter}-{n}</span>
                    <p style={{ margin:0,fontSize:10,color:hasCustomVoice?'#2ED573':'#888' }}>{hasCustomVoice ? '🎙️ Custom Voice' : 'TTS Default'}</p>
                  </div>
                  {isRecording ? (
                    <button onClick={stopRecording} style={{ padding:'6px 12px',background:'#FF4757',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontWeight:700,fontSize:11,flexShrink:0 }}>⏹ STOP</button>
                  ) : saving && editing === n ? (
                    <button disabled style={{ padding:'6px 12px',background:'#666',color:'#fff',border:'none',borderRadius:6,fontSize:11,flexShrink:0 }}>💾 ...</button>
                  ) : (
                    <button onClick={() => { setEditing(n); startRecording(n, letter); }} style={{ padding:'6px 12px',background:'#FF4757',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontWeight:700,fontSize:11,flexShrink:0 }}>🎙️ REC</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <style>{'@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}'}</style>
    </>
  );
}
