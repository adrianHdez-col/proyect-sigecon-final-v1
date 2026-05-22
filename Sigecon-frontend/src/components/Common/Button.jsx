import '../Common/Button.css';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? 'full-width' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="loading-spinner"></span> : children}
    </button>
  );
};
