import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { auth } = req.query;
    const authPath = Array.isArray(auth) ? auth.join('/') : auth;

    try {
        const response = await axios({
            method: req.method,
            url: `${API_BASE_URL}/auth/${authPath}`,
            data: req.body,
            headers: {
                'Content-Type': 'application/json',
                // Forward any necessary headers from the client
                ...(req.headers.authorization && { Authorization: req.headers.authorization }),
            },
        });

        res.status(response.status).json(response.data);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            res.status(error.response?.status || 500).json(error.response?.data || { error: 'Server error' });
        } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }
}