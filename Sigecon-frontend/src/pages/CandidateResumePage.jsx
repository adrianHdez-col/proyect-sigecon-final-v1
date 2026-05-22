import { useState } from 'react';
import { Button } from '../components/Common/Button';
import { Card, CardBody } from '../components/Common/Card';
import { ResumeView } from '../components/Resume/ResumeView';
import { ResumeForm } from '../components/Resume/ResumeForm';
import { mockCandidateResume } from '../utils/mockData';
import '../styles/pages.css';

export const CandidateResumePage = () => {
  const [resume, setResume] = useState(mockCandidateResume);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveResume = (data) => {
    setResume(prev => ({
      ...prev,
      ...data,
    }));
    setIsEditing(false);
    alert('Hoja de vida actualizada exitosamente');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <span className="page-eyebrow">Perfil profesional</span>
          <h1>Hoja de vida del aspirante</h1>
          <p>Mantiene experiencia, educacion, habilidades y certificaciones listas para postularse.</p>
        </div>
        {!isEditing && (
          <Button variant="primary" onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="edit-resume">
          <ResumeForm
            initialData={resume}
            onSubmit={handleSaveResume}
          />
          <Card className="form-actions">
            <CardBody>
              <Button
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
            </CardBody>
          </Card>
        </div>
      ) : (
        <ResumeView resume={resume} editable={true} />
      )}
    </div>
  );
};
