require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const connectDB = require('./config/db');
const { router: authRoutes } = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');

connectDB(process.env.MONGO_URI);

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Socket.io for realtime
const io = new Server(server, { cors: { origin: '*' }});
app.set('io', io);

io.on('connection', socket => {
  console.log('client connected', socket.id);
  socket.on('joinProject', (projectId) => {
    socket.join(`project_${projectId}`);
  });
  socket.on('leaveProject', (projectId) => {
    socket.leave(`project_${projectId}`);
  });
  socket.on('disconnect', () => console.log('client disconnected', socket.id));
});

// start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
