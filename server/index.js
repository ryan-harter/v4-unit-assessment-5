require('dotenv').config();
const massive = require('massive')
const session = require('express-session')
const express = require('express'),
      userCtrl = require('./controllers/user'),
      postCtrl = require('./controllers/posts'),
      {SERVER_PORT, CONNECTION_STRING, SESSION_SECRET} = process.env

const app = express();

app.use(express.json());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: SESSION_SECRET,
  cookie: {maxAge: 1000 * 60 * 60 * 24 * 365 }
}))

massive({
  connectionString: CONNECTION_STRING,
  ssl: {rejectUnauthorized: false}
}).then (dbInstance => {
  app.set('db', dbInstance)
  console.log('database connected')
})

//Auth Endpoints
 app.post('/api/auth/register', userCtrl.register);
 app.post('/api/auth/login', userCtrl.login);
 app.get('/api/auth/me', userCtrl.getUser);
 app.post('/api/auth/logout', userCtrl.logout);

//Post Endpoints
app.get('/api/posts', postCtrl.readPosts);
app.post('/api/post', postCtrl.createPost);
app.get('/api/post/:id', postCtrl.readPost);
app.delete('/api/post/:id', postCtrl.deletePost)

app.listen(SERVER_PORT, () => console.log(`running on ${SERVER_PORT}`));