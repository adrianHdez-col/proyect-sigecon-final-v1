import { useState } from 'react';
import { Button } from '../Common/Button';
import { Input, TextArea } from '../Common/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../Common/Card';
import '../Applications/ApplicationForm.css';

export const ApplicationForm = ({ vacancy, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    email: '',
    phone: '',
    coverLetter: '',
    attachCV: null,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'file' ? files?.[0] : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.candidateName) newErrors.candidateName = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    if (!formData.phone) newErrors.phone = 'El teléfono es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ ...formData, vacancyId: vacancy.id });
    }
  };

  return (
    <Card className="form-card">
      <CardHeader>
        <h2>Aplicar a: {vacancy.title}</h2>
        <p>{vacancy.department} - {vacancy.location}</p>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="application-form">
          <Input
            label="Nombre Completo"
            name="candidateName"
            value={formData.candidateName}
            onChange={handleChange}
            error={errors.candidateName}
            placeholder="Tu nombre"
            required
          />

          <div className="form-row">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="tu@email.com"
              required
              containerClass="form-col"
            />

            <Input
              label="Teléfono"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              error={errors.phone}
              placeholder="+57..."
              required
              containerClass="form-col"
            />
          </div>

          <TextArea
            label="Carta de Presentación"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            placeholder="Cuéntanos por qué eres un buen candidato para este puesto..."
          />

          <Input
            label="Adjuntar Hoja de Vida (PDF)"
            type="file"
            name="attachCV"
            onChange={handleChange}
            accept=".pdf,.doc,.docx"
          />

          <div className="vacancy-highlights">
            <h3>Requisitos del Puesto</h3>
            <ul>
              {vacancy.requirements?.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>

          <CardFooter>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              Enviar Aplicación
            </Button>
          </CardFooter>
        </form>
      </CardBody>
    </Card>
  );
};
