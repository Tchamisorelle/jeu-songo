
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const SSE = require('express-sse');
const http = require('http').createServer(app);
const path = require('path');
// Configuration de la connexion à la base de données
const port = 3000;

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'jeu_songo',
  user: 'postgres',
  password: 'postgres',
});

// Middleware pour le traitement des données JSON

app.get('/', (req, res) => {
  res.send('Bienvenue sur le serveur du jeu');
});
app.get('/connexion'), (res, rep) => {
  res.sendFile(__dirname + '/connect.html');
};
app.get('/gast'), (res, rep) => {
  res.sendFile(__dirname + 'site_officiel/Picture.html');
};
app.get('/habil'), (res, rep) => {
  res.sendFile(__dirname + 'site_officiel/About.html');
};
app.get('/hobi'), (res, rep) => {
  res.sendFile(__dirname + 'site_officiel/Gastronomy.html');
};
app.get('/ind'), (res, rep) => {
  res.sendFile(__dirname + 'site_officiel/index.html');
};
//ouvrir les page /J_vs_COM.html et j1_vs_j2.html a partir du server
app.get('/J1_vs_J2.html', (req, res) => {
  res.sendFile(__dirname + '/J1_vs_J2.html');
});
app.get('/connect.html', (req, res) => {
  res.sendFile(__dirname + '/connect.html');
});
app.get('/J_vs_COM.html', (req, res) => {
  res.sendFile(__dirname + '/J_vs_COM.html');
});
app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const serveStatic = require('serve-static');
app.use(serveStatic(__dirname, { 'Content-Type': 'application/javascript' }));
app.use('/bootstrap/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/bootstrap/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.use(express.static(__dirname));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('site_officiel'));
// Route pour les informations d'un joueur
app.get('/player/:joueur', (req, res) => {
  const playername = req.params.joueur;

  const query = {
    text: 'SELECT * FROM joueur WHERE playername = $1',
    values: [playername],
  };

  pool.query(query)
    .then((result) => {
      if (result.rows.length > 0) {
        const playerData = result.rows[0]; // Récupérer les données du joueur trouvé
        res.json(playerData); // Renvoyer les informations du joueur
      } else {
        res.status(404).json({ message: "Ce joueur n'a pas encore joué à cette partie." });
      }
    })
    .catch((error) => {
      console.error('Erreur lors de l\'extraction des données du joueur', error);
      res.status(500).send('Erreur lors de l\'extraction des données du joueur');
    });
});

// Route pour l'enregistrement d'un nouveau joueur
app.post('/regist', (req, res) => {
  const { playername } = req.body;

  const query = {
    text: 'SELECT * FROM joueur WHERE playername = $1',
    values: [playername],
  };

  pool.query(query)
    .then((result) => {
      if (result.rows.length > 0) {
        res.json({ message: 'Bon retour sur Songo' });
      } else {
        const query = {
          text: 'INSERT INTO joueur (playername, score) VALUES ($1, 0)',
          values: [playername],
        };
        pool.query(query)
          .then(() => {
            res.json({ message: 'Bienvenue dans Songo!' });
          })
          .catch((error) => {
            console.error('Erreur lors de l\'enregistrement du joueur', error);
            res.status(500).send('Erreur lors de l\'enregistrement du joueur');
          });
      }
    })
    .catch((error) => {
      console.error('Erreur lors de la vérification du joueur', error);
      res.status(500).send('Erreur lors de la vérification du joueur');
    });
});
http.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

// Création de l'objet SSE
//const sse = new SSE();

// Route pour la communication en temps réel avec les joueurs
// app.get('/game', (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   res.setHeader('Access-Control-Allow-Origin', '*');

//   sse.init(req, res);

//   // Gérer la connexion d'un joueur
//   sse.send('connected', 'Welcome to the game!');

//   // Gérer les mouvements des joueurs
//   app.post('/move', (req, res) => {
//     const { playerId, move } = req.body;
//     // Logique pour traiter le mouvement du joueur
//     sse.send('move', { playerId, move });
//     res.sendStatus(200);
//   });

//   // Gérer la déconnexion d'un joueur
//   req.on('close', () => {
//     // Logique pour gérer la déconnexion d'un joueur
//     sse.send('disconnected', 'Player disconnected');
//   });
// });

// Démarrage du serveur


