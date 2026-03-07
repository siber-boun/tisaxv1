export function FormSection({ title, description, children }) {
  return (
    <section className="section card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="section-content">{children}</div>
    </section>
  );
}

export function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  helper,
  error,
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      {helper ? <small>{helper}</small> : null}
      {error ? <em className="error">{error}</em> : null}
    </label>
  );
}

export function SelectField({ label, value, onChange, options, required = false, helper, error }) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Select...</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {helper ? <small>{helper}</small> : null}
      {error ? <em className="error">{error}</em> : null}
    </label>
  );
}

export function TextAreaField({ label, value, onChange, required = false, helper, error }) {
  return (
    <label className="field full">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} />
      {helper ? <small>{helper}</small> : null}
      {error ? <em className="error">{error}</em> : null}
    </label>
  );
}
