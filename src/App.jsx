import { useState } from 'react'
import StepProduct from './components/StepProduct'
import StepBuyer from './components/StepBuyer'
import StepPain from './components/StepPain'
import PersonaCard from './components/PersonaCard'
import { generatePersona } from './api'
import './App.css'

const STEPS = ['Product', 'Buyer', 'Pain Points', 'Result']

function App() {
  const [step, setStep] = useState(0)
  const [formData, setFormData] = useState({
    product: '',
    industry: '',
    jobTitle: '',
    companySize: '',
    painPoints: '',
    goals: '',
  })
  const [persona, setPersona] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (fields) => setFormData((prev) => ({ ...prev, ...fields }))

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await generatePersona(formData)
      setPersona(result)
      setStep(3)
    } catch (err) {
      setError(err.message || 'Failed to generate persona.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setStep(0)
    setPersona(null)
    setFormData({
      product: '',
      industry: '',
      jobTitle: '',
      companySize: '',
      painPoints: '',
      goals: '',
    })
  }

  return (
    <div className="app">
      <header>
        <h1>ICP Persona Builder</h1>
        <nav className="stepper">
          {STEPS.map((label, i) => (
            <span key={label} className={`step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              {label}
            </span>
          ))}
        </nav>
      </header>

      <main>
        {step === 0 && (
          <StepProduct data={formData} onChange={update} onNext={() => setStep(1)} />
        )}
        {step === 1 && (
          <StepBuyer data={formData} onChange={update} onBack={() => setStep(0)} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <StepPain
            data={formData}
            onChange={update}
            onBack={() => setStep(1)}
            onGenerate={handleGenerate}
            loading={loading}
          />
        )}
        {step === 3 && persona && (
          <PersonaCard persona={persona} onReset={handleReset} />
        )}
        {error && <p className="error">{error}</p>}
      </main>
    </div>
  )
}

export default App
