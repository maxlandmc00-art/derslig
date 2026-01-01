const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(process.cwd(), 'veri.json');

app.use(cors());
app.use(bodyParser.json());

// Verileri Oku
const readData = () => {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({ data: [] }));
    }
    const content = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(content);
};

// Verileri Yaz
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// API: Tüm Kayıtları Getir
app.get('/api/records', (req, res) => {
    try {
        const db = readData();
        res.json(db);
    } catch (err) {
        res.status(500).json({ error: "Veri okuma hatasi" });
    }
});

// API: Yeni Kayıt Ekle
app.post('/api/records', (req, res) => {
    try {
        const db = readData();
        const newRecord = req.body;
        db.data.push(newRecord);
        saveData(db);
        res.status(201).json(newRecord);
    } catch (err) {
        res.status(500).json({ error: "Veri yazma hatasi" });
    }
});

// API: Kayıt Sil
app.delete('/api/records/:id', (req, res) => {
    try {
        let db = readData();
        db.data = db.data.filter(r => r.id !== req.params.id);
        saveData(db);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Silme hatasi" });
    }
});

// Ana sayfa yönlendirmesi
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Vercel için modül olarak dışa aktar
module.exports = app;

// Local test için port dinlemesi (Vercel bunu otomatik yönetir)
if (process.env.NODE_ENV !== 'production') {
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Sunucu http://localhost:${PORT} üzerinde calisiyor`));
}
