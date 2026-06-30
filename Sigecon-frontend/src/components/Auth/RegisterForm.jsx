import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  CalendarDays,
  Eye,
  FileText,
  GraduationCap,
  Image,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from '../Common/Alert';
import logoImage from '../../assets/log.png';
import './LoginForm.css';

const roleHome = {
  recruiter: '/dashboard',
  aspirant: '/aspirant/dashboard',
};

const initialFormData = {
  accountType: '',
  companyName: '',
  companyId: '',
  sector: '',
  companySize: '',
  companyCountry: '',
  companyCity: '',
  companyAddress: '',
  companyWebsite: '',
  companyDescription: '',
  representativeName: '',
  representativePosition: '',
  corporateEmail: '',
  representativePhone: '',
  fullName: '',
  documentType: 'Cedula de ciudadania',
  documentNumber: '',
  birthDate: '',
  gender: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address: '',
  profession: '',
  desiredPosition: '',
  educationLevel: '',
  experienceYears: '',
  skills: '',
  password: '',
  confirmPassword: '',
  terms: false,
  newsletter: false,
};

const requiredFields = {
  company: [
    'companyName',
    'companyId',
    'sector',
    'companySize',
    'companyCountry',
    'companyCity',
    'companyAddress',
    'representativeName',
    'representativePosition',
    'corporateEmail',
    'representativePhone',
    'password',
    'confirmPassword',
  ],
  aspirant: [
    'fullName',
    'documentType',
    'documentNumber',
    'birthDate',
    'email',
    'phone',
    'country',
    'city',
    'profession',
    'educationLevel',
    'experienceYears',
    'password',
    'confirmPassword',
  ],
};

const fieldLabels = {
  companyName: 'Nombre de la empresa',
  companyId: 'NIT / numero de identificacion',
  sector: 'Sector / industria',
  companySize: 'Tamano de la empresa',
  companyCountry: 'Pais',
  companyCity: 'Ciudad',
  companyAddress: 'Direccion',
  representativeName: 'Nombre completo del representante',
  representativePosition: 'Cargo',
  corporateEmail: 'Correo corporativo',
  representativePhone: 'Numero de telefono',
  fullName: 'Nombre completo',
  documentType: 'Tipo de documento',
  documentNumber: 'Numero de documento',
  birthDate: 'Fecha de nacimiento',
  email: 'Correo electronico',
  phone: 'Numero de telefono',
  country: 'Pais',
  city: 'Ciudad',
  profession: 'Profesion / ocupacion',
  educationLevel: 'Nivel de estudios',
  experienceYears: 'Anos de experiencia',
  password: 'Contrasena',
  confirmPassword: 'Confirmar contrasena',
};

const Field = ({
  as = 'input',
  children,
  className = '',
  error,
  icon: Icon,
  label,
  name,
  required = false,
  ...props
}) => {
  const Control = as;

  return (
    <label className={`modern-field ${className}`}>
      <span>{label}{required && ' *'}</span>
      <div className={`modern-input ${as === 'textarea' ? 'modern-input-textarea' : ''} ${error ? 'modern-input-error' : ''}`}>
        {Icon && <Icon size={20} />}
        {as === 'input' ? (
          <Control name={name} {...props} />
        ) : (
          <Control name={name} {...props}>
            {children}
          </Control>
        )}
        {as === 'input' && children}
      </div>
    </label>
  );
};

const UploadBox = ({ label, title, description }) => (
  <div className="register-upload">
    <span>{label}</span>
    <div>
      <Image size={22} />
      <strong>{title}</strong>
      <small>{description}</small>
      <button type="button">Seleccionar archivo</button>
    </div>
  </div>
);

export const RegisterForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isCompany = formData.accountType === 'company';
  const hasAccountType = Boolean(formData.accountType);

  const handleAccountType = (accountType) => {
    setFormData((prev) => ({ ...prev, accountType }));
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!hasAccountType) {
      nextErrors.accountType = 'Selecciona el tipo de cuenta';
      setErrors(nextErrors);
      return false;
    }

    const fields = isCompany ? requiredFields.company : requiredFields.aspirant;

    fields.forEach((field) => {
      if (!String(formData[field] || '').trim()) {
        nextErrors[field] = `Completa ${fieldLabels[field].toLowerCase()}`;
      }
    });

    const email = isCompany ? formData.corporateEmail : formData.email;
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors[isCompany ? 'corporateEmail' : 'email'] = 'Ingresa un correo valido';
    }

    if (formData.password.length < 8) {
      nextErrors.password = 'Usa minimo 8 caracteres';
    }

    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contrasenas no coinciden';
    }

    if (!formData.terms) {
      nextErrors.terms = 'Debes aceptar los terminos';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const role = isCompany ? 'recruiter' : 'aspirant';
    const fullName = isCompany ? formData.representativeName : formData.fullName;
    const email = isCompany ? formData.corporateEmail : formData.email;
    const company = isCompany ? formData.companyName : 'SIGECON';

    setLoading(true);
    const result = await register({
      fullName,
      email,
      company,
      role,
      password: formData.password,
      companyName: isCompany ? formData.companyName : null,
      companyNit: isCompany ? formData.companyId : null,
      companyAddress: isCompany ? formData.companyAddress : null,
      companyPhone: isCompany ? formData.representativePhone : null,
      companyEmail: isCompany ? formData.corporateEmail : null,
      companyWebsite: isCompany ? formData.companyWebsite : null,
    });
    setLoading(false);

    if (result.success) {
      navigate(roleHome[role]);
    } else {
      setErrors((prev) => ({ ...prev, server: result.error }));
    }
  };

  return (
    <section className="register-showcase register-showcase-wide">
      <form onSubmit={handleSubmit} className="register-card register-card-wide">
        <div className="modern-form-header register-header register-header-compact">
          <div className="register-brand">
            <img src={logoImage} alt="SIGECON" />
          </div>
          <h1>Crea tu cuenta</h1>
          <p>Unete como empresa reclutadora o aspirante y comienza a formar parte de nuestra comunidad.</p>
        </div>

        <div className="account-type-tabs" aria-label="Tipo de cuenta">
          <button
            type="button"
            className={formData.accountType === 'company' ? 'active' : ''}
            onClick={() => handleAccountType('company')}
          >
            <Building2 size={22} />
            <span>
              <strong>Soy empresa</strong>
              <small>Publica vacantes y encuentra talento</small>
            </span>
          </button>
          <button
            type="button"
            className={formData.accountType === 'aspirant' ? 'active' : ''}
            onClick={() => handleAccountType('aspirant')}
          >
            <User size={22} />
            <span>
              <strong>Soy aspirante</strong>
              <small>Encuentra oportunidades laborales</small>
            </span>
          </button>
        </div>

        {errors.accountType && (
          <Alert type="error" message="Selecciona si eres empresa o aspirante para continuar." />
        )}

        {hasAccountType && Object.keys(errors).filter((key) => key !== 'accountType').length > 0 && (
          <Alert type="error" message="Revisa los campos marcados para continuar." />
        )}

        {errors.server && (
          <Alert type="error" message={errors.server} />
        )}

        {!hasAccountType && (
          <div className="register-empty-state">
            <strong>Selecciona el tipo de cuenta</strong>
            <span>El formulario correspondiente aparecera aqui cuando elijas una opcion.</span>
          </div>
        )}

        {hasAccountType && isCompany && (
          <div className="registration-panel">
            <div className="register-section">
              <div className="register-section-title">
                <Building2 size={21} />
                <h2>Informacion de la empresa</h2>
              </div>

              <div className="register-grid register-grid-company">
                <Field label="Nombre de la empresa" name="companyName" required error={errors.companyName} value={formData.companyName} onChange={handleChange} placeholder="Ej. Tu Empresa S.A.S" />
                <Field label="NIT / Numero de identificacion" name="companyId" required error={errors.companyId} value={formData.companyId} onChange={handleChange} placeholder="Ej. 900123456-7" />
                <Field as="select" label="Sector / Industria" name="sector" required error={errors.sector} value={formData.sector} onChange={handleChange}>
                  <option value="">Selecciona un sector</option>
                  <option>Tecnologia</option>
                  <option>Salud</option>
                  <option>Educacion</option>
                  <option>Servicios</option>
                  <option>Construccion</option>
                </Field>
                <Field as="select" label="Tamano de la empresa" name="companySize" required error={errors.companySize} value={formData.companySize} onChange={handleChange}>
                  <option value="">Selecciona el tamano</option>
                  <option>1 a 10 empleados</option>
                  <option>11 a 50 empleados</option>
                  <option>51 a 200 empleados</option>
                  <option>Mas de 200 empleados</option>
                </Field>
                <Field as="select" label="Pais" name="companyCountry" required error={errors.companyCountry} value={formData.companyCountry} onChange={handleChange}>
                  <option value="">Selecciona el pais</option>
                  <option>Colombia</option>
                  <option>Mexico</option>
                  <option>Peru</option>
                  <option>Chile</option>
                </Field>
                <Field as="select" label="Ciudad" name="companyCity" required error={errors.companyCity} value={formData.companyCity} onChange={handleChange}>
                  <option value="">Selecciona la ciudad</option>
                  <option>Bogota</option>
                  <option>Medellin</option>
                  <option>Cali</option>
                  <option>Barranquilla</option>
                </Field>
                <Field label="Direccion" name="companyAddress" required error={errors.companyAddress} value={formData.companyAddress} onChange={handleChange} placeholder="Ej. Calle 123 #45-67, Oficina 301" />
                <Field label="Sitio web" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="www.tuempresa.com" />
                <Field as="textarea" className="register-grid-span-2" label="Descripcion de la empresa" name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Cuentanos sobre tu empresa, mision, vision y lo que los hace unicos..." maxLength={500} />
              </div>

              <UploadBox label="Logo de la empresa" title="Sube el logo de tu empresa" description="PNG o JPG (max. 2MB)" />
            </div>

            <div className="register-section">
              <div className="register-section-title">
                <User size={21} />
                <h2>Informacion del representante</h2>
              </div>
              <div className="register-grid">
                <Field label="Nombre completo" name="representativeName" required error={errors.representativeName} value={formData.representativeName} onChange={handleChange} placeholder="Ej. Juan Perez Gomez" />
                <Field label="Cargo" name="representativePosition" required error={errors.representativePosition} value={formData.representativePosition} onChange={handleChange} placeholder="Ej. Gerente de Talento Humano" />
                <Field icon={Mail} label="Correo corporativo" name="corporateEmail" required error={errors.corporateEmail} value={formData.corporateEmail} onChange={handleChange} placeholder="ejemplo@tuempresa.com" />
                <Field icon={Phone} label="Numero de telefono" name="representativePhone" required error={errors.representativePhone} value={formData.representativePhone} onChange={handleChange} placeholder="+57 300 123 4567" />
              </div>
            </div>
          </div>
        )}

        {hasAccountType && !isCompany && (
          <div className="registration-panel">
            <div className="register-section">
              <div className="register-section-title">
                <User size={21} />
                <h2>Informacion personal</h2>
              </div>
              <div className="register-grid">
                <Field label="Nombre completo" name="fullName" required error={errors.fullName} value={formData.fullName} onChange={handleChange} placeholder="Ej. Maria Camila Lopez" />
                <Field as="select" label="Tipo de documento" name="documentType" required error={errors.documentType} value={formData.documentType} onChange={handleChange}>
                  <option>Cedula de ciudadania</option>
                  <option>Tarjeta de identidad</option>
                  <option>Cedula de extranjeria</option>
                  <option>Pasaporte</option>
                </Field>
                <Field icon={FileText} label="Numero de documento" name="documentNumber" required error={errors.documentNumber} value={formData.documentNumber} onChange={handleChange} placeholder="Ej. 1234567890" />
                <Field icon={CalendarDays} type="date" label="Fecha de nacimiento" name="birthDate" required error={errors.birthDate} value={formData.birthDate} onChange={handleChange} />
                <Field as="select" label="Genero" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Selecciona una opcion</option>
                  <option>Femenino</option>
                  <option>Masculino</option>
                  <option>Otro</option>
                  <option>Prefiero no decirlo</option>
                </Field>
                <UploadBox label="Foto de perfil" title="Sube tu foto" description="JPG o PNG (max. 2MB)" />
              </div>
            </div>

            <div className="register-section">
              <div className="register-section-title">
                <Mail size={21} />
                <h2>Informacion de contacto</h2>
              </div>
              <div className="register-grid">
                <Field icon={Mail} label="Correo electronico" name="email" required error={errors.email} value={formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" />
                <Field icon={Phone} label="Numero de telefono" name="phone" required error={errors.phone} value={formData.phone} onChange={handleChange} placeholder="+57 300 123 4567" />
                <Field as="select" label="Pais" name="country" required error={errors.country} value={formData.country} onChange={handleChange}>
                  <option value="">Selecciona tu pais</option>
                  <option>Colombia</option>
                  <option>Mexico</option>
                  <option>Peru</option>
                  <option>Chile</option>
                </Field>
                <Field as="select" label="Ciudad" name="city" required error={errors.city} value={formData.city} onChange={handleChange}>
                  <option value="">Selecciona tu ciudad</option>
                  <option>Bogota</option>
                  <option>Medellin</option>
                  <option>Cali</option>
                  <option>Barranquilla</option>
                </Field>
                <Field className="register-grid-span-2" icon={MapPin} label="Direccion" name="address" value={formData.address} onChange={handleChange} placeholder="Ej. Calle 123 #45-67, Barrio, Ciudad" />
              </div>
            </div>

            <div className="register-section">
              <div className="register-section-title">
                <Briefcase size={21} />
                <h2>Informacion profesional</h2>
              </div>
              <div className="register-grid">
                <Field icon={GraduationCap} label="Profesion / Ocupacion" name="profession" required error={errors.profession} value={formData.profession} onChange={handleChange} placeholder="Ej. Ingeniero de Sistemas" />
                <Field icon={Briefcase} label="Cargo deseado" name="desiredPosition" value={formData.desiredPosition} onChange={handleChange} placeholder="Ej. Desarrollador Full Stack" />
                <Field as="select" label="Nivel de estudios" name="educationLevel" required error={errors.educationLevel} value={formData.educationLevel} onChange={handleChange}>
                  <option value="">Selecciona tu nivel de estudios</option>
                  <option>Bachiller</option>
                  <option>Tecnico</option>
                  <option>Tecnologo</option>
                  <option>Profesional</option>
                  <option>Posgrado</option>
                </Field>
                <Field as="select" label="Anos de experiencia" name="experienceYears" required error={errors.experienceYears} value={formData.experienceYears} onChange={handleChange}>
                  <option value="">Selecciona tus anos de experiencia</option>
                  <option>Sin experiencia</option>
                  <option>1 a 2 anos</option>
                  <option>3 a 5 anos</option>
                  <option>Mas de 5 anos</option>
                </Field>
                <Field className="register-grid-span-2" icon={FileText} label="Habilidades" name="skills" value={formData.skills} onChange={handleChange} placeholder="Ej. JavaScript, React, Node.js, Liderazgo" />
              </div>
            </div>
          </div>
        )}

        {hasAccountType && (
          <>
            <div className="register-section register-section-flat">
              <div className="register-section-title">
                <LockKeyhole size={21} />
                <h2>Informacion de acceso</h2>
              </div>
              <div className="register-grid register-grid-access">
                <Field icon={Mail} label="Correo electronico" name={isCompany ? 'corporateEmail' : 'email'} required error={isCompany ? errors.corporateEmail : errors.email} value={isCompany ? formData.corporateEmail : formData.email} onChange={handleChange} placeholder="ejemplo@correo.com" />
                <Field icon={LockKeyhole} type="password" label="Contrasena" name="password" required error={errors.password} value={formData.password} onChange={handleChange} placeholder="Minimo 8 caracteres">
                  <Eye size={20} />
                </Field>
                <Field icon={LockKeyhole} type="password" label="Confirmar contrasena" name="confirmPassword" required error={errors.confirmPassword} value={formData.confirmPassword} onChange={handleChange} placeholder="Confirma tu contrasena">
                  <Eye size={20} />
                </Field>
              </div>
            </div>

            <div className="register-section register-section-flat">
              <div className="register-section-title">
                <ShieldCheck size={21} />
                <h2>Verificacion y terminos</h2>
              </div>
              <label className={`terms-row ${errors.terms ? 'terms-row-error' : ''}`}>
                <input type="checkbox" name="terms" checked={formData.terms} onChange={handleChange} />
                <span>Acepto los <a href="#terminos">Terminos y condiciones</a> y la <a href="#privacidad">Politica de privacidad</a> *</span>
              </label>
              <label className="terms-row">
                <input type="checkbox" name="newsletter" checked={formData.newsletter} onChange={handleChange} />
                <span>Deseo recibir comunicaciones y novedades de la plataforma</span>
              </label>
            </div>
          </>
        )}

        <button type="submit" className="modern-submit" disabled={loading || !hasAccountType}>
          {loading
            ? 'Creando cuenta...'
            : hasAccountType
              ? `Crear cuenta de ${isCompany ? 'empresa' : 'aspirante'}`
              : 'Selecciona un tipo de cuenta'}
        </button>

        <p className="auth-switch modern-switch">
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </form>
    </section>
  );
};
