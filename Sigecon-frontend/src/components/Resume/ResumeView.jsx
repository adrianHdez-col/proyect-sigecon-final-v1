import { Mail, Phone, MapPin, Download } from 'lucide-react';
import { Button } from '../Common/Button';
import { Card, CardBody, CardHeader } from '../Common/Card';
import '../Resume/ResumeView.css';

export const ResumeView = ({ resume, editable = false, onEdit }) => {
  return (
    <div className="resume-container">
      <Card className="resume-header-card">
        <CardBody className="resume-top">
          <div className="resume-title">
            <h1>{resume.fullName}</h1>
            <p className="resume-summary">{resume.professionalSummary}</p>
          </div>
          <div className="resume-contact">
            <a href={`mailto:${resume.email}`} className="contact-link">
              <Mail size={18} />
              {resume.email}
            </a>
            <a href={`tel:${resume.phone}`} className="contact-link">
              <Phone size={18} />
              {resume.phone}
            </a>
            <div className="contact-link">
              <MapPin size={18} />
              {resume.location}
            </div>
          </div>
          {editable && (
            <Button variant="outline" onClick={onEdit}>
              Editar Hoja de Vida
            </Button>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Experiencia Laboral</h2>
        </CardHeader>
        <CardBody>
          {resume.experience?.map((exp) => (
            <div key={exp.id} className="resume-item">
              <div className="resume-item-header">
                <h3>{exp.position}</h3>
                <span className="resume-dates">
                  {new Date(exp.startDate).getFullYear()} - {exp.current ? 'Presente' : new Date(exp.endDate).getFullYear()}
                </span>
              </div>
              <p className="resume-company">{exp.company}</p>
              <p className="resume-description">{exp.description}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Educación</h2>
        </CardHeader>
        <CardBody>
          {resume.education?.map((edu) => (
            <div key={edu.id} className="resume-item">
              <div className="resume-item-header">
                <h3>{edu.degree}</h3>
              </div>
              <p className="resume-institution">{edu.institution}</p>
              <p className="resume-description">{edu.description}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Habilidades</h2>
        </CardHeader>
        <CardBody>
          <div className="skills-grid">
            {resume.skills?.map((skill) => (
              <div key={skill.id} className="skill-item">
                <span className="skill-name">{skill.name}</span>
                <div className="skill-level">
                  <div
                    className="skill-bar"
                    style={{
                      width: `${skill.level === 'experto' ? 100 : skill.level === 'avanzado' ? 75 : 50}%`
                    }}
                  ></div>
                </div>
                <span className="skill-text">{skill.level}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2>Certificaciones</h2>
        </CardHeader>
        <CardBody>
          {resume.certifications?.map((cert) => (
            <div key={cert.id} className="resume-item">
              <h3>{cert.name}</h3>
              <p className="resume-issuer">{cert.issuer} - {new Date(cert.date).toLocaleDateString('es-ES')}</p>
            </div>
          ))}
        </CardBody>
      </Card>

      <div className="resume-actions">
        <Button variant="primary" size="lg">
          <Download size={20} />
          Descargar PDF
        </Button>
      </div>
    </div>
  );
};
