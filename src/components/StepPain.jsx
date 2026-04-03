export default function StepPain({ data, onChange, onBack, onGenerate, loading }) {
  const valid = data.painPoints.trim().length > 0 && data.goals.trim().length > 0

  return (
    <div className="step-card">
      <h2>What are their pain points and goals?</h2>

      <label htmlFor="painPoints">Top Pain Points</label>
      <textarea
        id="painPoints"
        rows={3}
        placeholder="e.g. Manual invoice processing wastes 20+ hours/week, high error rates, no visibility into spend."
        value={data.painPoints}
        onChange={(e) => onChange({ painPoints: e.target.value })}
      />

      <label htmlFor="goals">Key Goals</label>
      <textarea
        id="goals"
        rows={3}
        placeholder="e.g. Reduce processing time by 80%, achieve 99% accuracy, get real-time spend reports."
        value={data.goals}
        onChange={(e) => onChange({ goals: e.target.value })}
      />

      <div className="actions">
        <button className="secondary" onClick={onBack} disabled={loading}>
          &larr; Back
        </button>
        <button onClick={onGenerate} disabled={!valid || loading}>
          {loading ? 'Generating…' : 'Generate Persona'}
        </button>
      </div>
    </div>
  )
}
