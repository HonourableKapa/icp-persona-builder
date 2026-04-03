export default function PersonaCard({ persona, onReset }) {
  const {
    name,
    title,
    company,
    industry,
    companySize,
    background,
    painPoints,
    goals,
    buyingTriggers,
    objections,
    messagingHook,
  } = persona

  return (
    <div className="persona-card">
      <div className="persona-header">
        <div className="avatar">{name?.[0] ?? '?'}</div>
        <div>
          <h2>{name}</h2>
          <p className="subtitle">{title} &mdash; {company}</p>
          <p className="meta">{industry} &bull; {companySize} employees</p>
        </div>
      </div>

      <section>
        <h3>Background</h3>
        <p>{background}</p>
      </section>

      <div className="two-col">
        <section>
          <h3>Pain Points</h3>
          <ul>{painPoints?.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </section>
        <section>
          <h3>Goals</h3>
          <ul>{goals?.map((g, i) => <li key={i}>{g}</li>)}</ul>
        </section>
      </div>

      <div className="two-col">
        <section>
          <h3>Buying Triggers</h3>
          <ul>{buyingTriggers?.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </section>
        <section>
          <h3>Common Objections</h3>
          <ul>{objections?.map((o, i) => <li key={i}>{o}</li>)}</ul>
        </section>
      </div>

      <section className="hook-box">
        <h3>Messaging Hook</h3>
        <blockquote>{messagingHook}</blockquote>
      </section>

      <div className="actions">
        <button className="secondary" onClick={onReset}>
          Start Over
        </button>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(persona, null, 2)], {
              type: 'application/json',
            })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `${name?.replace(/\s+/g, '_') ?? 'persona'}_icp.json`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          Download JSON
        </button>
      </div>
    </div>
  )
}
