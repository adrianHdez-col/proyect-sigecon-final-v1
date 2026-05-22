import '../Common/Input.css';

export const Input = ({
  label,
  type = 'text',
  error,
  helperText,
  containerClass = '',
  ...props
}) => {
  return (
    <div className={`input-group ${containerClass}`}>
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="required">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
      {helperText && <span className="helper-text">{helperText}</span>}
    </div>
  );
};

export const Select = ({
  label,
  options = [],
  error,
  helperText,
  containerClass = '',
  ...props
}) => {
  return (
    <div className={`input-group ${containerClass}`}>
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="required">*</span>}
        </label>
      )}
      <select
        className={`input-field select-field ${error ? 'input-error' : ''}`}
        {...props}
      >
        <option value="">Selecciona una opción</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
      {helperText && <span className="helper-text">{helperText}</span>}
    </div>
  );
};

export const TextArea = ({
  label,
  error,
  helperText,
  containerClass = '',
  ...props
}) => {
  return (
    <div className={`input-group ${containerClass}`}>
      {label && (
        <label className="input-label">
          {label}
          {props.required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        className={`input-field textarea-field ${error ? 'input-error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
      {helperText && <span className="helper-text">{helperText}</span>}
    </div>
  );
};

export const Checkbox = ({ label, containerClass = '', ...props }) => {
  return (
    <div className={`checkbox-group ${containerClass}`}>
      <input type="checkbox" id={props.id} className="checkbox-field" {...props} />
      {label && <label htmlFor={props.id} className="checkbox-label">{label}</label>}
    </div>
  );
};
