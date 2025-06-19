import React, { useState } from 'react'
import axios from 'axios'

export default function SymptomForm({ setDiagnosis }) {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!input) return
    setLoading(true)
    try {
      const res = await axios.post("http://localhost:5000/diagnose", {
        symptoms: input
      })
      setDiagnosis(res.data.diagnosis)
    } catch (err) {
      setDiagnosis("⚠️ Error: Could not contact the AI backend.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <textarea
        rows="4"
        placeholder="Describe your symptoms here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', padding: '10px', borderRadius: '5px' }}
      />
      <br />
      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ padding: '10px 20px', marginTop: '10px' }}
      >
        {loading ? "Diagnosing..." : "Diagnose"}
      </button>
    </div>
  )
}
