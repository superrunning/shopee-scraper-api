const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 3000;
const VALID_API_KEY = process.env.API_KEY;

app.use(express.json());

app.post('/titulo', async (req, res) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey || apiKey !== VALID_API_KEY) {
    return res.status(401).json({ erro: 'API key inválida.' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ erro: 'URL não fornecida no body.' });
  }

  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(html);
    const titulo = $('meta[property="og:title"]').attr('content') || '';

    res.json({ titulo });
  } catch (err) {
    res.status(500).json({ erro: 'Erro ao buscar título.', detalhes: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
