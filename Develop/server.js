const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
  });
  
  app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
  });

  app.get('/api/notes', (req, res) => {
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    res.json(notes);
  });
  
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    newNote.id = notes.length;
    notes.push(newNote);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(notes), 'utf8');
    res.json(newNote);
  });
  
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const notes = JSON.parse(fs.readFileSync(path.join(__dirname, './db/db.json'), 'utf8'));
    const updatedNotes = notes.filter((note) => note.id !== noteId);
    fs.writeFileSync(path.join(__dirname, './db/db.json'), JSON.stringify(updatedNotes), 'utf8'); 
    res.json(updatedNotes);
  });

  app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
  });