const COMPANY_SIZES = [
  '1–10',
  '11–50',
  '51–200',
  '201–500',
  '501–1000',
  '1001–5000',
  '5000+',
]

export default function StepBuyer({ data, onChange, onBack, onNext }) {
  const valid = data.industry.trim() && data.jobTitle.trim() && data.companySize

  return (
    <div className="step-card">
      <h2>Who is your ideal buyer?</h2>

      <label htmlFor="industry">Industry</label>
      <input
        id="industry"
        type="text"
        placeholder="e.g. Financial Services, Healthcare, SaaS"
        value={data.industry}
        onChange={(e) => onChange({ industry: e.target.value })}
      />

      <label htmlFor="jobTitle">Job Title</label>
      <input
        id="jobTitle"
        type="text"
        placeholder="e.g. VP of Finance, Head of Operations"
        value={data.jobTitle}
        onChange={(e) => onChange({ jobTitle: e.target.value })}
      />

      <label htmlFor="companySize">Company Size (employees)</label>
      <select
        id="companySize"
        value={data.companySize}
        onChange={(e) => onChange({ companySize: e.target.value })}
      >
        <option value="">Select a range…</option>
        {COMPANY_SIZES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      <div className="actions">
        <button className="secondary" onClick={onBack}>&larr; Back</button>
        <button onClick={onNext} disabled={!valid}>Next &rarr;</button>
      </div>
    </div>
  )
}
