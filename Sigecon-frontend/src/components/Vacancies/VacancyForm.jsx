import { useState } from 'react';
import { Button } from '../Common/Button';
import { Input, Select, TextArea } from '../Common/Input';
import { Card, CardHeader, CardBody, CardFooter } from '../Common/Card';
import '../Vacancies/VacancyForm.css';

export const VacancyForm = ({ initialData, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    department: '',
    description: '',
    requirements: '',
    salaryRange: '',
    location: '',
    type: '',
    deadline: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
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
    if (!formData.title) newErrors.title = 'El título es requerido';
    if (!formData.department) newErrors.department = 'El departamento es requerido';
    if (!formData.description) newErrors.description = 'La descripción es requerida';
    if (!formData.salaryRange) newErrors.salaryRange = 'El rango salarial es requerido';
    if (!formData.location) newErrors.location = 'La ubicación es requerida';
    if (!formData.type) newErrors.type = 'El tipo de contrato es requerido';

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
    <Card className="form-card">
      <CardHeader>
        <h2>{initialData?.id ? 'Editar Vacante' : 'Crear Nueva Vacante'}</h2>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="vacancy-form">
          <div className="form-row">
            <Input
              label="Título del Puesto"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Ej: Ingeniero de Software Senior"
              required
              containerClass="form-col"
            />

            <Select
              label="Departamento"
              name="department"
              value={formData.department}
              onChange={handleChange}
              error={errors.department}
              options={[
                { value: 'Desarrollo', label: 'Desarrollo' },
                { value: 'Diseño', label: 'Diseño' },
                { value: 'Analytics', label: 'Analytics' },
                { value: 'RRHH', label: 'RRHH' },
                { value: 'Ventas', label: 'Ventas' },
              ]}
              required
              containerClass="form-col"
            />
          </div>

          <TextArea
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={errors.description}
            placeholder="Describe los detalles del puesto..."
            required
          />

          <Input
            label="Requisitos (separados por comas)"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="React, Node.js, PostgreSQL"
          />

          <div className="form-row">
            <Input
              label="Rango Salarial"
              name="salaryRange"
              value={formData.salaryRange}
              onChange={handleChange}
              error={errors.salaryRange}
              placeholder="Ej: $3000 - $5000"
              required
              containerClass="form-col"
            />

            <Input
              label="Ubicación"
              name="location"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              placeholder="Ej: Bogotá"
              required
              containerClass="form-col"
            />
          </div>

          <div className="form-row">
            <Select
              label="Tipo de Contrato"
              name="type"
              value={formData.type}
              onChange={handleChange}
              error={errors.type}
              options={[
                { value: 'Tiempo Completo', label: 'Tiempo Completo' },
                { value: 'Medio Tiempo', label: 'Medio Tiempo' },
                { value: 'Contratista', label: 'Contratista' },
              ]}
              required
              containerClass="form-col"
            />

            <Input
              label="Fecha Límite"
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              containerClass="form-col"
            />
          </div>

          <CardFooter>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
            >
              {initialData?.id ? 'Actualizar' : 'Crear'} Vacante
            </Button>
          </CardFooter>
        </form>
      </CardBody>
    </Card>
  );
};
