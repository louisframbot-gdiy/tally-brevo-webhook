export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  try {
    const { data } = req.body;
    if (!data || !data.fields) {
      return res.status(400).json({ message: 'Payload Tally invalide' });
    }
    const emailField = data.fields.find(f =>
      f.type === 'INPUT_EMAIL' || (f.label && f.label.toLowerCase().includes('email'))
    );
    if (!emailField?.value) {
      return res.status(400).json({ message: 'Email introuvable' });
    }
    const email = emailField.value;
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email,
        attributes: { FAIT_TEST: true },
        listIds: [33],
        updateEnabled: true,
      }),
    });
    const responseBody = await response.json();
    if (!response.ok && response.status !== 204) {
      return res.status(500).json({ message: 'Erreur Brevo', detail: responseBody });
    }
    return res.status(200).json({ success: true, email });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
