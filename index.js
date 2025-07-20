import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import bcrypt from'bcrypt';
import WebSocket, { WebSocketServer } from 'ws';

const app = express();
const port = 3000;

const users = [
  {
    username: 'ananna',
    passwordHash: bcrypt.hashSync('ananna', 10) // hashed password
  },
  {
    username: 'armaan',
    passwordHash: bcrypt.hashSync('armaan', 10) // hashed password
  },
];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 1 // 1 hour
  }
}));
app.set('view engine', 'ejs');

// Routes
app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const matchedUser = users.find(u => u.username === username);

  if (matchedUser.username === username && bcrypt.compareSync(password, matchedUser.passwordHash)) {
    req.session.user = username;
    res.redirect('/dashboard');
  } else {
    res.render('login', { error: 'Sorry, invalid username or password' });
  }
});

app.get('/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  res.render('dashboard', { user: req.session.user });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

const server = app.listen(port, () => {
  console.log(`App running on: http://localhost:${port}`)
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
    
    // Broadcast the message to all clients
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(Buffer.from(message).toString('utf-8'));
        // client.send(message);
      }
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});