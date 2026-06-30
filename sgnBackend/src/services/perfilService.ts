import { db } from '../db/connection.js';

const emptyResume = {
  title: '',
  location: '',
  linkedin: '',
  website: '',
  languages: '',
  professionalSummary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
};

const parseJson = (value: unknown, fallback: any[] = []) => {
  if (!value) return fallback;
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(String(value));
  } catch {
    return fallback;
  }
};

const stringifyJson = (value: unknown) => JSON.stringify(Array.isArray(value) ? value : []);

const calculateCompletion = (resume: any) => {
  const checks = [
    resume.fullName,
    resume.email,
    resume.phone,
    resume.title,
    resume.location,
    resume.professionalSummary,
    resume.experience?.length,
    resume.education?.length,
    resume.skills?.length,
    resume.languages,
  ];

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const mapProfile = (row: any) => {
  const resume = {
    id: row.profileId || null,
    fullName: row.fullName || '',
    email: row.email || '',
    phone: row.profilePhone || row.phone || '',
    title: row.title || emptyResume.title,
    location: row.location || row.userLocation || emptyResume.location,
    linkedin: row.linkedin || row.userLinkedin || emptyResume.linkedin,
    website: row.website || row.userWebsite || emptyResume.website,
    languages: row.languages || emptyResume.languages,
    professionalSummary: row.professionalSummary || emptyResume.professionalSummary,
    experience: parseJson(row.experience),
    education: parseJson(row.education),
    skills: parseJson(row.skills),
    certifications: parseJson(row.certifications),
    completion: Number(row.completion || 0),
  };

  return {
    ...resume,
    completion: resume.completion || calculateCompletion(resume),
  };
};

export const getCandidateProfile = async (userId: number) => {
  const [rows] = await db.query(
    `SELECT
      u.id AS userId,
      u.nombre_completo AS fullName,
      u.email,
      u.telefono AS phone,
      u.ubicacion AS userLocation,
      u.linkedin AS userLinkedin,
      u.sitio_web AS userWebsite,
      cp.id AS profileId,
      cp.titulo AS title,
      cp.ubicacion AS location,
      cp.telefono AS profilePhone,
      cp.linkedin,
      cp.sitio_web AS website,
      cp.idiomas AS languages,
      cp.resumen_profesional AS professionalSummary,
      cp.experiencia AS experience,
      cp.educacion AS education,
      cp.habilidades AS skills,
      cp.certificaciones AS certifications,
      cp.completitud AS completion
    FROM usuarios u
    LEFT JOIN candidato_perfiles cp ON cp.usuario_id = u.id
    WHERE u.id = ?`,
    [userId]
  );

  if (!Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  return mapProfile(rows[0]);
};

export const upsertCandidateProfile = async (userId: number, data: any) => {
  const nextResume = {
    ...emptyResume,
    ...data,
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
  };
  const completion = calculateCompletion(nextResume);

  await db.execute(
    `UPDATE usuarios
     SET nombre_completo = ?, telefono = ?, cargo_objetivo = ?, ubicacion = ?, linkedin = ?, sitio_web = ?
     WHERE id = ?`,
    [
      nextResume.fullName,
      nextResume.phone || null,
      nextResume.title || null,
      nextResume.location || null,
      nextResume.linkedin || null,
      nextResume.website || null,
      userId,
    ]
  );

  await db.execute(
    `INSERT INTO candidato_perfiles (
      usuario_id,
      titulo,
      ubicacion,
      telefono,
      linkedin,
      sitio_web,
      idiomas,
      resumen_profesional,
      experiencia,
      educacion,
      habilidades,
      certificaciones,
      completitud
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      titulo = VALUES(titulo),
      ubicacion = VALUES(ubicacion),
      telefono = VALUES(telefono),
      linkedin = VALUES(linkedin),
      sitio_web = VALUES(sitio_web),
      idiomas = VALUES(idiomas),
      resumen_profesional = VALUES(resumen_profesional),
      experiencia = VALUES(experiencia),
      educacion = VALUES(educacion),
      habilidades = VALUES(habilidades),
      certificaciones = VALUES(certificaciones),
      completitud = VALUES(completitud)`,
    [
      userId,
      nextResume.title || null,
      nextResume.location || null,
      nextResume.phone || null,
      nextResume.linkedin || null,
      nextResume.website || null,
      nextResume.languages || null,
      nextResume.professionalSummary || null,
      stringifyJson(nextResume.experience),
      stringifyJson(nextResume.education),
      stringifyJson(nextResume.skills),
      stringifyJson(nextResume.certifications),
      completion,
    ]
  );

  return getCandidateProfile(userId);
};
