const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3000;

// Configuração da conexão com MySQL
const db = mysql.createConnection({
  host: 'db',
  user: 'root',
  password: 'shazam',
  database: 'nodedb'
});

// Conecta com o MySQL
db.connect(err => {
  if (err) {
    console.error('Erro ao conectar com o banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com ID ' + db.threadId);
});

app.get('/', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 1000);  // Gera um número aleatório entre 0 e 999
  const name = "Natasha" + randomNumber;  // Concatena "Natasha" com o número aleatório

  // Adiciona o nome gerado ao banco de dados
  const query = 'INSERT INTO people (name) VALUES (?)';
  db.query(query, [name], (err, results) => {
    if (err) {
      console.error('Erro ao inserir dados: ' + err.stack);
      return res.status(500).send('Erro ao inserir dados.');
    }
    
    // Pega a lista de nomes da base de dados
    db.query('SELECT name FROM people', (err, rows) => {
      if (err) {
        console.error('Erro ao recuperar dados: ' + err.stack);
        return res.status(500).send('Erro ao recuperar dados.');
      }
      
      const allNames = rows.map(row => row.name).join(', ');
      res.send(`<h1>Full Cycle Rocks!</h1>People: ${allNames}`);
    });
  });
});

app.listen(port, () => {
  console.log('Rodando na porta ' + port);
});
