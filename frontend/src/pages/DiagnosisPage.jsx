import React from 'react'
import ReactMarkdown from 'react-markdown'

export default function DiagnosisPage({ diagnosis, goBack }) {
  return (
    <div className="layout" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <div className="right" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', maxWidth: '700px' }}>
        <div className="diagnosis-card" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', width: '100%', padding: '35px' }}>
          <ReactMarkdown>{diagnosis}</ReactMarkdown>
        </div>
        <button 
          onClick={goBack} 
          style={{ 
            marginTop: '20px', 
            width: '100%', 
            maxWidth: '700px', /* Matches diagnosis-card max-width exactly */
            padding: '12px 30px' 
          }}
        >
          Back
        </button>
      </div>
    </div>
  )
}