module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Manejo seguro del body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {}
  }

  const { name, email, subject, message } = body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const apiKey = process.env.WEB3FORMS_KEY;

  // Si la variable no está configurada en Vercel, tiramos un error claro
  if (!apiKey) {
    console.error('ERROR: Falta la variable WEB3FORMS_KEY en Vercel');
    return res.status(500).json({ error: 'Error de configuración del servidor' });
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        access_key: apiKey,
        name,
        email,
        subject: subject || 'Contacto desde la web',
        message,
      }),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('ERROR conectando a Web3Forms:', err);
    return res.status(500).json({ error: 'Error interno de servidor' });
  }
};
