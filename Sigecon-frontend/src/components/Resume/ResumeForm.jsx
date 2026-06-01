import { useState } from 'react';
import { Button } from '../Common/Button';
import { Card, CardBody, CardHeader } from '../Common/Card';
import { Input, TextArea, Select, Checkbox } from '../Common/Input';
import '../Resume/ResumeForm.css';

export const ResumeForm = ({ initialData, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState(initialData || {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    website: '',
    languages: '',
    professionalSummary: '',
    experience: [{ id: 1, company: '', position: '', startDate: '', endDate: '', current: false, description: '', attachment: null }],
    education: [{ id: 1, institution: '', degree: '', startDate: '', endDate: '', description: '' }],
    skills: [{ id: 1, name: '', level: 'intermedio' }],
    certifications: [{ id: 1, name: '', issuer: '', date: '', file: null }],
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleArrayChange = (section, index, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleFileChange = (section, index, field, file) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, [field]: file } : item
      ),
    }));
  };

  const addArrayItem = (section) => {
    const templates = {
      experience: { id: Date.now(), company: '', position: '', startDate: '', endDate: '', current: false, description: '', attachment: null },
      education: { id: Date.now(), institution: '', degree: '', startDate: '', endDate: '', description: '' },
      skills: { id: Date.now(), name: '', level: 'intermedio' },
      certifications: { id: Date.now(), name: '', issuer: '', date: '', file: null },
    };
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]],
    }));
  };

  const removeArrayItem = (section, index) => {
    setFormData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="resume-form">
      <Card>
        <CardHeader>
          <h2>Información Personal</h2>
        </CardHeader>
        <CardBody>
          <div className="form-row">
            <Input
              label="Nombre Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
              containerClass="form-col"
            />
            <Input
              label="Título Profesional"
              name="title"
              value={formData.title}
              onChange={handleChange}
              containerClass="form-col"
            />
          </div>
          <div className="form-row">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              containerClass="form-col"
            />
            <Input
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              required
              containerClass="form-col"
            />
          </div>
          <div className="form-row">
            <Input
              label="Ubicación"
              name="location"
              value={formData.location}
              onChange={handleChange}
              containerClass="form-col"
            />
            <Input
              label="LinkedIn"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              containerClass="form-col"
            />
          </div>
          <div className="form-row">
            <Input
              label="Sitio web / Portfolio"
              name="website"
              value={formData.website}
              onChange={handleChange}
              containerClass="form-col"
            />
            <Input
              label="Idiomas"
              name="languages"
              value={formData.languages}
              onChange={handleChange}
              placeholder="Ej. Español, Inglés"
              containerClass="form-col"
            />
          </div>
          <TextArea
            label="Resumen Profesional"
            name="professionalSummary"
            value={formData.professionalSummary}
            onChange={handleChange}
            placeholder="Cuéntanos sobre tu experiencia y objetivos profesionales"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Experiencia Laboral</h2>
        </CardHeader>
        <CardBody className="array-section">
          {formData.experience.map((exp, idx) => (
            <div key={idx} className="array-item">
              <div className="form-row">
                <Input
                  label="Empresa"
                  value={exp.company}
                  onChange={(e) => handleArrayChange('experience', idx, 'company', e.target.value)}
                  containerClass="form-col"
                />
                <Input
                  label="Posición"
                  value={exp.position}
                  onChange={(e) => handleArrayChange('experience', idx, 'position', e.target.value)}
                  containerClass="form-col"
                />
              </div>
              <div className="form-row">
                <Input
                  label="Fecha de Inicio"
                  type="date"
                  value={exp.startDate}
                  onChange={(e) => handleArrayChange('experience', idx, 'startDate', e.target.value)}
                  containerClass="form-col"
                />
                {!exp.current && (
                  <Input
                    label="Fecha de Fin"
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => handleArrayChange('experience', idx, 'endDate', e.target.value)}
                    containerClass="form-col"
                  />
                )}
              </div>
              <Checkbox
                label="Actualmente trabajo aquí"
                checked={exp.current}
                onChange={(e) => handleArrayChange('experience', idx, 'current', e.target.checked)}
              />
              <TextArea
                label="Descripción"
                value={exp.description}
                onChange={(e) => handleArrayChange('experience', idx, 'description', e.target.value)}
              />
              <Input
                label="Archivo adjunto (experiencia)"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => handleFileChange('experience', idx, 'attachment', e.target.files?.[0] || null)}
                helperText={exp.attachment ? `Archivo cargado: ${exp.attachment.name}` : 'PDF o imagen opcional'}
              />
              {formData.experience.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeArrayItem('experience', idx)}
                >
                  Eliminar
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('experience')}
            type="button"
          >
            + Agregar Experiencia
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Educación</h2>
        </CardHeader>
        <CardBody className="array-section">
          {formData.education.map((edu, idx) => (
            <div key={idx} className="array-item">
              <Input
                label="Institución"
                value={edu.institution}
                onChange={(e) => handleArrayChange('education', idx, 'institution', e.target.value)}
              />
              <Input
                label="Grado/Carrera"
                value={edu.degree}
                onChange={(e) => handleArrayChange('education', idx, 'degree', e.target.value)}
              />
              <div className="form-row">
                <Input
                  label="Año de Inicio"
                  type="number"
                  value={edu.startDate}
                  onChange={(e) => handleArrayChange('education', idx, 'startDate', e.target.value)}
                  containerClass="form-col"
                />
                <Input
                  label="Año de Fin"
                  type="number"
                  value={edu.endDate}
                  onChange={(e) => handleArrayChange('education', idx, 'endDate', e.target.value)}
                  containerClass="form-col"
                />
              </div>
              <TextArea
                label="Descripción"
                value={edu.description}
                onChange={(e) => handleArrayChange('education', idx, 'description', e.target.value)}
              />
              {formData.education.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeArrayItem('education', idx)}
                >
                  Eliminar
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('education')}
            type="button"
          >
            + Agregar Educación
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Habilidades</h2>
        </CardHeader>
        <CardBody className="array-section">
          {formData.skills.map((skill, idx) => (
            <div key={idx} className="array-item form-row">
              <Input
                label="Habilidad"
                value={skill.name}
                onChange={(e) => handleArrayChange('skills', idx, 'name', e.target.value)}
                containerClass="form-col"
              />
              <Select
                label="Nivel"
                value={skill.level}
                onChange={(e) => handleArrayChange('skills', idx, 'level', e.target.value)}
                options={[
                  { value: 'basico', label: 'Básico' },
                  { value: 'intermedio', label: 'Intermedio' },
                  { value: 'avanzado', label: 'Avanzado' },
                  { value: 'experto', label: 'Experto' },
                ]}
                containerClass="form-col"
              />
              {formData.skills.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeArrayItem('skills', idx)}
                  className="align-button"
                >
                  Eliminar
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('skills')}
            type="button"
          >
            + Agregar Habilidad
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Certificaciones</h2>
        </CardHeader>
        <CardBody className="array-section">
          {formData.certifications.map((cert, idx) => (
            <div key={idx} className="array-item">
              <div className="form-row">
                <Input
                  label="Certificación"
                  value={cert.name}
                  onChange={(e) => handleArrayChange('certifications', idx, 'name', e.target.value)}
                  containerClass="form-col"
                />
                <Input
                  label="Entidad"
                  value={cert.issuer}
                  onChange={(e) => handleArrayChange('certifications', idx, 'issuer', e.target.value)}
                  containerClass="form-col"
                />
              </div>
              <Input
                label="Fecha"
                type="date"
                value={cert.date}
                onChange={(e) => handleArrayChange('certifications', idx, 'date', e.target.value)}
              />
              <Input
                label="Adjuntar certificado"
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => handleFileChange('certifications', idx, 'file', e.target.files?.[0] || null)}
                helperText={cert.file ? `Archivo cargado: ${cert.file.name}` : 'PDF o imagen opcional'}
              />
              {formData.certifications.length > 1 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeArrayItem('certifications', idx)}
                >
                  Eliminar
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => addArrayItem('certifications')}
            type="button"
          >
            + Agregar Certificación
          </Button>
        </CardBody>
      </Card>

      <div className="form-actions">
        <Button variant="primary" size="lg" loading={loading}>
          Guardar Hoja de Vida
        </Button>
      </div>
    </form>
  );
};
