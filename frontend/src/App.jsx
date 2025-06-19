import React, { useState } from 'react'
import SymptomPage from './pages/SymptomPage'
import DiagnosisPage from './pages/DiagnosisPage'
import './App.css'

function App() {
  const [diagnosis, setDiagnosis] = useState("")
  const [selectedPart, setSelectedPart] = useState("")
  const [markerPos, setMarkerPos] = useState(null)
  const [page, setPage] = useState("input")

  return (
    <div className="app">
      <header className="site-header">
        <h1>Sympta</h1>
      </header>
      {page === "input" ? (
        <SymptomPage
          setDiagnosis={setDiagnosis}
          selectedPart={selectedPart}
          setSelectedPart={setSelectedPart}
          markerPos={markerPos}
          setMarkerPos={setMarkerPos}
          goToDiagnosis={() => setPage("diagnosis")}
        />
      ) : (
        <DiagnosisPage
          diagnosis={diagnosis}
          markerPos={markerPos}
          goBack={() => setPage("input")}
        />
      )}
    </div>
  )
}

export default App