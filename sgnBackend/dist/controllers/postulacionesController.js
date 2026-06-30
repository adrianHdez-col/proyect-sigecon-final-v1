import { createApplication, getCandidateApplications } from '../services/postulacionesServices.js';
export const getMyApplications = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        const applications = await getCandidateApplications(Number(user.id));
        return res.status(200).json({ success: true, data: applications });
    }
    catch (error) {
        console.error('Get applications error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
export const applyToVacancy = async (req, res) => {
    try {
        const user = req.user;
        const { vacancyId, coverLetter, candidateName, email, phone } = req.body;
        if (!user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        if (!vacancyId) {
            return res.status(400).json({ message: 'vacancyId es obligatorio.' });
        }
        const comments = [
            candidateName ? `Nombre: ${candidateName}` : null,
            email ? `Email: ${email}` : null,
            phone ? `Teléfono: ${phone}` : null,
            coverLetter ? `Carta: ${coverLetter}` : null,
        ]
            .filter(Boolean)
            .join('\n');
        const applicationId = await createApplication(Number(user.id), Number(vacancyId), comments || null);
        return res.status(201).json({
            success: true,
            data: {
                id: applicationId,
                vacancyId: Number(vacancyId),
                status: 'postulado',
            },
        });
    }
    catch (error) {
        console.error('Apply vacancy error:', error);
        if (error.statusCode && error.message) {
            return res.status(error.statusCode).json({ message: error.message });
        }
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
