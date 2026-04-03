export default function StepProduct({ data, onChange, onNext }) {
  const valid = data.product.trim().length > 0

  return (
    <div className="step-card">
      <h2>What is your product or service?</h2>
      <p>Describe what you sell in one or two sentences.</p>

      <label htmlFor="product">Product / Service</label>
      <textarea
        id="product"
        rows={4}
        placeholder="e.g. A SaaS platform that automates accounts payable workflows for mid-market companies."
        value={data.product}
        onChange={(e) => onChange({ product: e.target.value })}
      />

      <div className="actions">
        <button onClick={onNext} disabled={!valid}>
          Next &rarr;
        </button>
      </div>
    </div>
  )
}
