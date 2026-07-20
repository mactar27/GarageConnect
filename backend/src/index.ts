import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';

import clientRoutes from './routes/client.routes';
import mecanicienRoutes from './routes/mecanicien.routes';
import adminRoutes from './routes/admin.routes';
import responsableRoutes from './routes/responsable.routes';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/avatars', express.static(path.join(__dirname, '../public/avatars')));

app.use('/api/auth', authRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/mecanicien', mecanicienRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/responsable', responsableRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
  res.send('GarageConnect API (Backend) is running. Veuillez visiter le front-end sur le port 4200.');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'GarageConnect API is running' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
