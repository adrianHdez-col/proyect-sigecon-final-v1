// Mock data para desarrollar sin backend

export const mockVacancies = [
  {
    id: 1,
    title: 'Ingeniero de Software Senior',
    department: 'Desarrollo',
    description: 'Buscamos ingeniero con 5+ años de experiencia en desarrollo web',
    requirements: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    salaryRange: '$4000 - $6000',
    location: 'Bogotá',
    type: 'Tiempo Completo',
    publishDate: '2024-01-15',
    deadline: '2024-02-15',
    status: 'active',
    applicants: 15,
  },
  {
    id: 2,
    title: 'Analista de Datos',
    department: 'Analytics',
    description: 'Necesitamos analista para gestionar datos empresariales',
    requirements: ['Python', 'SQL', 'Tableau', 'Excel avanzado'],
    salaryRange: '$3000 - $4500',
    location: 'Medellín',
    type: 'Tiempo Completo',
    publishDate: '2024-01-10',
    deadline: '2024-02-10',
    status: 'active',
    applicants: 8,
  },
  {
    id: 3,
    title: 'Diseñador UX/UI',
    department: 'Diseño',
    description: 'Buscamos diseñador creativo para proyectos web y mobile',
    requirements: ['Figma', 'Adobe XD', 'Prototipado', 'User Research'],
    salaryRange: '$2500 - $3800',
    location: 'Bogotá',
    type: 'Tiempo Completo',
    publishDate: '2024-01-12',
    deadline: '2024-02-12',
    status: 'active',
    applicants: 12,
  },
];

export const mockApplications = [
  {
    id: 1,
    vacancyId: 1,
    candidateName: 'Carlos González',
    email: 'carlos@email.com',
    phone: '3001234567',
    status: 'en_revision',
    appliedDate: '2024-01-20',
    score: 85,
  },
  {
    id: 2,
    vacancyId: 1,
    candidateName: 'María López',
    email: 'maria@email.com',
    phone: '3009876543',
    status: 'conocimiento_pendiente',
    appliedDate: '2024-01-19',
    score: 0,
  },
  {
    id: 3,
    vacancyId: 2,
    candidateName: 'Ana Martínez',
    email: 'ana@email.com',
    phone: '3005551234',
    status: 'psicotecnico_pendiente',
    appliedDate: '2024-01-21',
    score: 90,
  },
];

export const mockCandidateResume = {
  id: 1,
  fullName: 'Juan Pérez García',
  title: 'Ingeniero de Software Senior',
  email: 'juan.perez@email.com',
  phone: '3001234567',
  location: 'Bogotá, Colombia',
  linkedin: 'https://www.linkedin.com/in/juanperez',
  website: 'https://juanperez.dev',
  languages: 'Español, Inglés',
  professionalSummary:
    'Ingeniero de Software con 7 años de experiencia en desarrollo de aplicaciones web y móviles. Experto en React, Node.js y arquitectura de microservicios.',
  experience: [
    {
      id: 1,
      company: 'Tech Solutions Inc',
      position: 'Senior Developer',
      startDate: '2021-03-01',
      endDate: null,
      current: true,
      description: 'Lideré equipo de 5 desarrolladores en proyectos de e-commerce',
    },
    {
      id: 2,
      company: 'Digital Innovations',
      position: 'Developer',
      startDate: '2019-01-15',
      endDate: '2021-02-28',
      current: false,
      description: 'Desarrollé aplicaciones web con React y Angular',
    },
  ],
  education: [
    {
      id: 1,
      institution: 'Universidad Nacional de Colombia',
      degree: 'Ingeniería de Sistemas',
      startDate: '2015-01-01',
      endDate: '2019-12-31',
      description: 'Énfasis en Ingeniería de Software',
    },
  ],
  skills: [
    { id: 1, name: 'React', level: 'experto' },
    { id: 2, name: 'Node.js', level: 'experto' },
    { id: 3, name: 'PostgreSQL', level: 'avanzado' },
    { id: 4, name: 'AWS', level: 'intermedio' },
    { id: 5, name: 'Liderazgo', level: 'avanzado' },
  ],
  certifications: [
    { id: 1, name: 'AWS Solutions Architect', issuer: 'Amazon', date: '2023-06-15' },
    { id: 2, name: 'Google Cloud Professional', issuer: 'Google', date: '2022-09-20' },
  ],
};

export const mockKnowledgeTest = {
  id: 1,
  vacancyId: 1,
  title: 'Test de Conocimientos - Ingeniero Senior',
  duration: 60, // minutos
  totalQuestions: 20,
  passingScore: 70,
  questions: [
    {
      id: 1,
      type: 'multiple_choice',
      question: '¿Cuál es el principal beneficio de usar React?',
      options: [
        'Mayor velocidad de carga',
        'Reutilización de componentes y manejo eficiente del DOM virtual',
        'Mejor rendimiento en bases de datos',
        'Facilita la programación en Backend',
      ],
      correctAnswer: 1,
    },
    {
      id: 2,
      type: 'multiple_choice',
      question: '¿Qué es un microservicio?',
      options: [
        'Un pequeño servicio que consume pocos recursos',
        'Una arquitectura donde la aplicación se divide en servicios pequeños, independientes y desacoplados',
        'Un framework para desarrollar aplicaciones',
        'Una librería de JavaScript',
      ],
      correctAnswer: 1,
    },
    {
      id: 3,
      type: 'true_false',
      question: 'PostgreSQL es una base de datos NoSQL',
      correctAnswer: false,
    },
    {
      id: 4,
      type: 'short_answer',
      question: 'Describe qué es la escalabilidad en una aplicación web',
      correctAnswer:
        'La capacidad de una aplicación para manejar un crecimiento en la cantidad de usuarios y datos sin perder rendimiento',
    },
  ],
};

export const mockPsychometricTest = {
  id: 1,
  vacancyId: 1,
  title: 'Test Psicotécnico - Análisis de Personalidad',
  duration: 30, // minutos
  questions: [
    {
      id: 1,
      type: 'scale',
      question: 'Me considero una persona muy creativa',
      scale: 5, // 1-5
    },
    {
      id: 2,
      type: 'scale',
      question: 'Prefiero trabajar en equipo que solo',
      scale: 5,
    },
    {
      id: 3,
      type: 'scale',
      question: 'Tengo buena capacidad para resolver problemas bajo presión',
      scale: 5,
    },
    {
      id: 4,
      type: 'multiple_choice',
      question: 'Cuando enfrento un problema complejo, yo:',
      options: [
        'Lo divido en partes más pequeñas',
        'Busco ayuda inmediatamente',
        'Lo dejo para después',
        'Actúo por instinto',
      ],
    },
  ],
};

export const mockInductionExam = {
  id: 1,
  title: 'Examen de Inducción - Políticas Empresariales',
  duration: 20, // minutos
  totalQuestions: 10,
  passingScore: 80,
  questions: [
    {
      id: 1,
      question: '¿Cuál es la política de horario de la empresa?',
      options: [
        'Flexible, de 6am a 6pm',
        'Fijo de 8am a 5pm',
        'Flexible, de 7am a 4pm',
        'No hay política específica',
      ],
      correctAnswer: 0,
    },
    {
      id: 2,
      question: '¿Cuántos días de vacaciones tiene un empleado nuevo?',
      options: ['10 días', '15 días', '20 días', '30 días'],
      correctAnswer: 1,
    },
    {
      id: 3,
      question: '¿Cuál es el código de ética de la empresa?',
      options: [
        'Integridad, honestidad y transparencia',
        'Solo productividad',
        'Máximas ganancias',
        'No hay código de ética',
      ],
      correctAnswer: 0,
    },
  ],
};

export const statusLabels = {
  en_revision: 'En Revisión',
  conocimiento_pendiente: 'Prueba de Conocimiento Pendiente',
  conocimiento_completado: 'Prueba de Conocimiento Completada',
  psicotecnico_pendiente: 'Test Psicotécnico Pendiente',
  psicotecnico_completado: 'Test Psicotécnico Completado',
  induccion_pendiente: 'Inducción Pendiente',
  induccion_completada: 'Inducción Completada',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

export const getStatusColor = (status) => {
  const colors = {
    en_revision: '#3b82f6',
    conocimiento_pendiente: '#f59e0b',
    conocimiento_completado: '#10b981',
    psicotecnico_pendiente: '#f59e0b',
    psicotecnico_completado: '#10b981',
    induccion_pendiente: '#f59e0b',
    induccion_completada: '#10b981',
    aprobado: '#10b981',
    rechazado: '#ef4444',
  };
  return colors[status] || '#6b7280';
};
