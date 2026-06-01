import { Mail, Phone, MapPin, Globe, Linkedin, Download } from 'lucide-react';
import { Button } from '../Common/Button';
import { Card, CardBody, CardHeader } from '../Common/Card';
import '../Resume/ResumeView.css';

export const ResumeView = ({ resume, editable = false, onEdit }) => {
  const languageList = resume.languages?.split(',').map(lang => lang.trim()).filter(Boolean) || [];

  return (
    <div className="resume-container">
      <div className="resume-main">
        <Card className="resume-header-card">
          <CardBody className="resume-top">
            <div className="resume-title">
              <h1>{resume.fullName}</h1>
              {resume.title && <p className="resume-role">{resume.title}</p>}
              <p className="resume-summary">{resume.professionalSummary}</p>
            </div>
            {editable && (
              <div className="resume-edit-action">
                <Button variant="outline" onClick={onEdit}>
                  Editar Hoja de Vida
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="resume-section-card">
          <CardHeader>
            <h2>Experiencia</h2>
          </CardHeader>
          <CardBody>
            {resume.experience?.map((exp) => (
              <div key={exp.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{exp.position}</h3>
                  <span className="resume-dates">
                    {exp.startDate ? new Date(exp.startDate).getFullYear() : ''} - {exp.current ? 'Presente' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}
                  </span>
                </div>
                <p className="resume-company">{exp.company}</p>
                <p className="resume-description">{exp.description}</p>
                {exp.attachment && (
                  <p className="resume-attachment">Archivo: {exp.attachment.name}</p>
                )}
              </div>
            ))}
          </CardBody>
        </Card>

        <Card className="resume-section-card">
          <CardHeader>
            <h2>Educación</h2>
          </CardHeader>
          <CardBody>
            {resume.education?.map((edu) => (
              <div key={edu.id} className="resume-item">
                <div className="resume-item-header">
                  <h3>{edu.degree}</h3>
                  <span className="resume-dates">
                    {edu.startDate ? new Date(edu.startDate).getFullYear() : ''} - {edu.endDate ? new Date(edu.endDate).getFullYear() : ''}
                  </span>
                </div>
                <p className="resume-company">{edu.institution}</p>
                <p className="resume-description">{edu.description}</p>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>

      <aside className="resume-sidebar">
        <Card className="resume-sidebar-card">
          <CardHeader>
            <h2>Contacto</h2>
          </CardHeader>
          <CardBody>
            <div className="contact-info">
              {resume.email && (
                <a href={`mailto:${resume.email}`} className="contact-link">
                  <Mail size={16} />
                  {resume.email}
                </a>
              )}
              {resume.phone && (
                <a href={`tel:${resume.phone}`} className="contact-link">
                  <Phone size={16} />
                  {resume.phone}
                </a>
              )}
              {resume.location && (
                <div className="contact-link">
                  <MapPin size={16} />
                  {resume.location}
                </div>
              )}
              {resume.website && (
                <a href={resume.website} target="_blank" rel="noreferrer" className="contact-link">
                  <Globe size={16} />
                  {resume.website}
                </a>
              )}
              {resume.linkedin && (
                <a href={resume.linkedin} target="_blank" rel="noreferrer" className="contact-link">
                  <Linkedin size={16} />
                  {resume.linkedin}
                </a>
              )}
            </div>
          </CardBody>
        </Card>

        <Card className="resume-sidebar-card">
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
                        width: `${skill.level === 'experto' ? 100 : skill.level === 'avanzado' ? 75 : skill.level === 'intermedio' ? 55 : 35}%`
                      }}
                    />
                  </div>
                  <span className="skill-text">{skill.level}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card className="resume-sidebar-card">
          <CardHeader>
            <h2>Idiomas</h2>
          </CardHeader>
          <CardBody>
            {languageList.length > 0 ? (
              <ul className="language-list">
                {languageList.map((lang) => (
                  <li key={lang}>{lang}</li>
                ))}
              </ul>
            ) : (
              <p className="resume-description">Agrega tus idiomas en la edición.</p>
            )}
          </CardBody>
        </Card>

        <Card className="resume-sidebar-card">
          <CardHeader>
            <h2>Certificaciones</h2>
          </CardHeader>
          <CardBody>
            {resume.certifications?.map((cert) => (
              <div key={cert.id} className="resume-item">
                <h3>{cert.name}</h3>
                <p className="resume-issuer">{cert.issuer} • {cert.date ? new Date(cert.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }) : 'Fecha pendiente'}</p>
                {cert.file && (
                  <p className="resume-attachment">Certificado: {cert.file.name}</p>
                )}
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
      </aside>
    </div>
  );
};
