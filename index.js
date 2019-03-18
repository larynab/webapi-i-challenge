const express = require('express');

const db = require('./data/db.js'); 

const server = express();

server.use(express.json()); 

server.get('/', (req, res) => {
  res.send('Hello Web XVII');
});


server.get('/now', (req, res) => {
  const now = new Date().toISOString();
  res.send(now);
});


server.post('/api/users', (req, res) => {
  const { name, bio, created_at, updated_at } = req.body;
  if (!name || !bio) {
    sendUserError(400, 'Error', res);
    return;
  }
  db
    .insert({
      name,
      bio,
      created_at,
      updated_at
    })
    .then(response => {
      res.status(201).json(response);
    })
    .catch(error => {
      console.log(error);
      sendUserError(400, error, res);
      return;
    });
});

server.get('/api/users', (req, res) => {
  db
    .find()
    .then(users => {
      res.json({ users });
    })
    .catch(error => {
      sendUserError(500, 'error', res);
      return;
    });
});

server.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db
    .findById(id)
    .then(user => {
      if (user.length === 0) {
        sendUserError(404, 'error', res);
        return;
      }
      res.json(user);
    })
    .catch(error => {
      sendUserError(500, 'Error', res);
    });
});

server.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db
    .remove(id)
    .then(response => {
      if (response === 0) {
        sendUserError(404, 'Error"', res);
        return;
      }
      res.json({ success: `Updated` });
    })
    .catch(error => {
      sendUserError(500, 'Error', res);
      return;
    });
});

server.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, bio } = req.body;
  if (!name || !bio) {
    sendUserError(400, 'Error', res);
    return;
  }
  db
    .update(id, { name, bio })
    .then(response => {
      if (response == 0) {
        sendUserError(
          404,
          'Error',
          res
        );
        return;
      }
      db
        .findById(id)
        .then(user => {
          if (user.length === 0) {
            sendUserError(404, 'Error', res);
            return;
          }
          res.json(user);
        })
        .catch(error => {
          sendUserError(500, 'Error', res);
        });
    })
    .catch(error => {
      sendUserError(500, 'Error', res);
      return;
    });
});

server.listen(4000, () => {
    console.log('\n** API up and running on port 4k **');
  });