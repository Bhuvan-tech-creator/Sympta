import React, { useState } from 'react';
import HumanModel from '../components/HumanModel';
import axios from 'axios';

export default function SymptomPage({
  setDiagnosis, selectedPart, setSelectedPart, markerPos, setMarkerPos, goToDiagnosis
}) {
  const [duration, setDuration] = useState('');
  const [age, setAge] = useState('');
  const [painWorsens, setPainWorsens] = useState('');
  const [extraDetails, setExtraDetails] = useState('');
  const [painType, setPainType] = useState('');
  const [severity, setSeverity] = useState(5);
  const [gender, setGender] = useState('');
  const [additionalSymptoms, setAdditionalSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAI = async () => {
    setLoading(true);
    const prompt = `
You are an experienced physician writing for a patient.
INPUT:
- Body location: ${selectedPart || 'unspecified'}
- Duration: ${duration || 'unspecified'}
- Age: ${age || 'unspecified'}
- Pain worsens with movement: ${painWorsens || 'unspecified'}
- Extra details: ${extraDetails || 'none'}
- Pain type: ${painType || 'unspecified'}
- Pain severity (1-10): ${severity}
- Gender: ${gender || 'unspecified'}
- Additional symptoms: ${additionalSymptoms || 'none'}
- Medical history: ${medicalHistory || 'none'}

Respond **ONLY** in this Markdown template:

### Diagnosis
**<Illness>** – One-sentence plain-English explanation.

### Remedies
- 3-5 evidence-based home or over-the-counter remedies patients can try safely.

End with a single-sentence disclaimer: "This is not medical advice; consult a doctor."
`;
    try {
      const response = await axios.post('https://sympta-backend.onrender.com/diagnose', { prompt });
      setDiagnosis(response.data.diagnosis);
    } catch (error) {
      setDiagnosis('⚠️ AI backend unreachable.');
      console.error('Error fetching diagnosis:', error);
    } finally {
      setLoading(false);
      goToDiagnosis();
    }
  };

  // Form validation: Require selectedPart, painType, and age
  const isFormValid = selectedPart && painType && age;

  return (
    <div className="layout">
      <div className="left">
        <HumanModel
          onPick={(name, point) => {
            setSelectedPart(name);
            setMarkerPos(point);
          }}
        />
      </div>
      <div className="right">
        <div className="form-card">
          <h2>Click on pain points</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Body Parts</label>
              <input readOnly value={selectedPart || 'Click model to select'} />
            </div>
            <div className="form-group">
              <label>Pain Type</label>
              <input
                value={painType}
                onChange={e => setPainType(e.target.value)}
                placeholder="e.g. sharp"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Duration</label>
              <input
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="e.g. 2 days"
              />
            </div>
            <div className="form-group">
              <label>Pain Severity (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={severity}
                onChange={e => setSeverity(Number(e.target.value))}
              />
              <span>{severity}</span>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">Select gender</option>
                <option>Male</option>
                <option>Female</option>
                <option>Non-binary</option>
                <option>Prefer not to say</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Does the pain worsen with movement?</label>
              <select value={painWorsens} onChange={e => setPainWorsens(e.target.value)}>
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="form-group">
              <label>Additional Symptoms</label>
              <input
                value={additionalSymptoms}
                onChange={e => setAdditionalSymptoms(e.target.value)}
                placeholder="e.g. swelling"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Extra Details</label>
              <input
                value={extraDetails}
                onChange={e => setExtraDetails(e.target.value)}
                placeholder="e.g. redness"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group full-width">
              <label>Medical History</label>
              <input
                value={medicalHistory}
                onChange={e => setMedicalHistory(e.target.value)}
                placeholder="e.g. none"
              />
            </div>
          </div>
          <button onClick={handleAI} disabled={loading || !isFormValid}>
            {loading ? 'Processing...' : 'Diagnose'}
          </button>
        </div>
      </div>
    </div>
  );
}