import { useState } from 'react';
import axios from 'axios';

export default function DeepfakeApp() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image first!");
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict', formData);
      setResult(response.data);
    } catch (err) {
      alert("System Offline: Ensure Backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getAccentColor = () => {
    if (loading) return '#3498db'; 
    if (!result) return '#6c5ce7'; 
    return result.label === 'FAKE' ? '#ff4757' : '#2ed573'; 
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Background Decorative Elements */}
      <div style={styles.gridOverlay} />
      
      <header style={styles.header}>
        <h1 style={styles.title}>🛡️ DEEP<span style={{color: getAccentColor()}}>SHIELD</span></h1>
        <p style={styles.subtitle}>FULL-SPECTRUM NEURAL ANALYSIS TERMINAL</p>
      </header>

      <main style={styles.contentArea}>
        {/* Left Side: Upload & Controls */}
        <section style={{...styles.controlPanel, boxShadow: `0 0 30px ${getAccentColor()}22`}}>
          <div style={styles.sectionHeader}>TARGET ACQUISITION</div>
          
          <label style={styles.fileInputLabel}>
            {file ? "🔄 REPLACE IMAGE" : "📂 SELECT SOURCE"}
            <input type="file" onChange={handleFileChange} accept="image/*" style={{display: 'none'}} />
          </label>

          <button 
            onClick={handleSubmit} 
            disabled={loading || !file} 
            style={loading ? styles.btnDisabled : {...styles.btnActive, backgroundColor: getAccentColor()}}
          >
            {loading ? "SCANNING PIXELS..." : "START NEURAL SCAN"}
          </button>

          {result && (
            <div style={{...styles.resultCard, borderColor: getAccentColor()}}>
              <small style={styles.statusBadge}>ANALYSIS COMPLETE</small>
              <h2 style={{color: getAccentColor()}}>{result.label}</h2>
              <div style={styles.progressContainer}>
                <div style={{...styles.progressFill, width: `${(result.confidence * 100)}%`, backgroundColor: getAccentColor()}} />
              </div>
              <p style={styles.confText}>PROBABILITY: {(result.confidence * 100).toFixed(2)}%</p>
            </div>
          )}
        </section>

        {/* Right Side: Large Preview Display */}
        <section style={styles.displayPanel}>
          {preview ? (
            <div style={styles.previewContainer}>
              <img src={preview} alt="Target" style={styles.mainImage} />
              {loading && <div style={styles.scanLine} />}
              <div style={styles.cornerTL} /><div style={styles.cornerTR} />
              <div style={styles.cornerBL} /><div style={styles.cornerBR} />
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>WAITING FOR SOURCE DATA...</p>
            </div>
          )}
        </section>
      </main>

      <footer style={styles.footer}>NODE_ID: 035B85 | SYSTEM_STATUS: {loading ? 'BUSY' : 'READY'}</footer>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0a0a12',
    color: '#fff',
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflowX: 'hidden'
  },
  gridOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
    backgroundSize: '40px 40px',
    pointerEvents: 'none'
  },
  header: {
    padding: '30px 5% 10px 5%',
    zIndex: 2
  },
  title: { fontSize: '2.2rem', fontWeight: '900', margin: 0, letterSpacing: '3px' },
  subtitle: { fontSize: '0.75rem', opacity: 0.5, letterSpacing: '4px', marginTop: '5px' },
  contentArea: {
    flex: 1,
    display: 'flex',
    padding: '20px 5%',
    gap: '30px',
    zIndex: 2
  },
  // Sidebar UI
  controlPanel: {
    width: '350px',
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  // Main Preview UI
  displayPanel: {
    flex: 1,
    background: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  },
  previewContainer: { position: 'relative', padding: '10px', maxWidth: '90%', maxHeight: '90%' },
  mainImage: { maxWidth: '100%', maxHeight: '70vh', borderRadius: '4px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' },
  emptyState: { opacity: 0.2, letterSpacing: '5px', fontWeight: 'bold' },
  
  // UI Elements
  sectionHeader: { fontSize: '0.7rem', opacity: 0.4, letterSpacing: '2px', fontWeight: 'bold' },
  fileInputLabel: { padding: '15px', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: '10px', textAlign: 'center', cursor: 'pointer', fontSize: '0.8rem', transition: '0.3s' },
  btnActive: { padding: '18px', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px', transition: '0.3s' },
  btnDisabled: { padding: '18px', borderRadius: '10px', backgroundColor: '#1e1e2e', color: '#444', border: 'none', cursor: 'not-allowed' },
  
  // Results
  resultCard: { marginTop: 'auto', padding: '20px', borderLeft: '4px solid', background: 'rgba(255,255,255,0.02)' },
  progressContainer: { height: '4px', background: 'rgba(255,255,255,0.1)', margin: '15px 0', borderRadius: '2px' },
  progressFill: { height: '100%', borderRadius: '2px', transition: 'width 0.5s ease-in-out' },
  confText: { fontSize: '0.8rem', margin: 0, opacity: 0.8 },
  statusBadge: { fontSize: '0.6rem', opacity: 0.5 },

  // Scan Animation & Corners
  scanLine: { position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#3498db', boxShadow: '0 0 15px #3498db', animation: 'scan 3s linear infinite' },
  cornerTL: { position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid #fff', borderLeft: '2px solid #fff', opacity: 0.3 },
  cornerTR: { position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid #fff', borderRight: '2px solid #fff', opacity: 0.3 },
  cornerBL: { position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid #fff', borderLeft: '2px solid #fff', opacity: 0.3 },
  cornerBR: { position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid #fff', borderRight: '2px solid #fff', opacity: 0.3 },
  footer: { padding: '15px 5%', fontSize: '0.65rem', opacity: 0.3, letterSpacing: '2px' }
};