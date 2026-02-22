const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'admin')));
app.use('/', express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'public')));

// Configuração de armazenamento de ficheiros
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const DB_FILE = 'database.json';

// Ler dados do "Banco de Dados"
const getSongs = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf-8') || '[]');

// Rotas da API
app.get('/api/songs', (req, res) => res.json(getSongs()));

app.post('/api/upload', upload.single('file'), (req, res) => {
    const songs = getSongs();
    const newSong = {
        id: Date.now(),
        title: req.body.title,
        month: req.body.month,
        filename: req.file.filename,
        originalName: req.file.originalname
    };
    songs.push(newSong);
    fs.writeFileSync(DB_FILE, JSON.stringify(songs, null, 2));
    res.json({ success: true });
});

app.delete('/api/songs/:id', (req, res) => {
    let songs = getSongs();
    const song = songs.find(s => s.id == req.params.id);
    if (song) {
        fs.unlinkSync(path.join(__dirname, 'uploads', song.filename));
        songs = songs.filter(s => s.id != req.params.id);
        fs.writeFileSync(DB_FILE, JSON.stringify(songs, null, 2));
    }
    res.json({ success: true });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));