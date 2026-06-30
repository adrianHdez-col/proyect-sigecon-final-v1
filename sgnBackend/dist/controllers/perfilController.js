import { getCandidateProfile, upsertCandidateProfile } from '../services/perfilService.js';
export const getMyProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        const profile = await getCandidateProfile(Number(user.id));
        return res.status(200).json({ success: true, data: profile });
    }
    catch (error) {
        console.error('Get profile error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
export const updateMyProfile = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        const profile = await upsertCandidateProfile(Number(user.id), req.body || {});
        return res.status(200).json({ success: true, data: profile });
    }
    catch (error) {
        console.error('Update profile error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
