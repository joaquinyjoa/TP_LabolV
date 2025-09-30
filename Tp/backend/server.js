// Importaciones
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const app = express();

// Middleware
app.use(cors()); // Permite que Angular haga peticiones

// Token de SuperHero API
const TOKEN = 'f1843d2d04d0b6cea2d9ba4e125bcb58';

// Endpoint random: devuelve héroe con imagen en Base64
app.get('/api/random', async (req, res) => {
  const randomId = Math.floor(Math.random() * 731) + 1;
  try {
    const heroResp = await fetch(`https://superheroapi.com/api/${TOKEN}/${randomId}/image`);
    const heroData = await heroResp.json();

    if (heroData.response !== 'success') {
      return res.status(500).json({ error: 'SuperHero API error', details: heroData });
    }

    // Usar URL directa, sin Base64
    res.json({
      id: heroData.id,
      name: heroData.name,
      image: heroData.url
    });

  } catch (err) {
    res.status(500).json({ error: 'Error al obtener la imagen', details: err.message });
  }
});


// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend escuchando en puerto ${PORT}`));
