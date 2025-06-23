const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/submit', (req, res) => {
  console.log('Получены данные:', req.body);
  res.status(200).json({ message: 'Данные успешно получены!' });
});
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
