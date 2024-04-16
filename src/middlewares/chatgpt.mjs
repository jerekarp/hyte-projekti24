import OpenAI from 'openai';

// Luodaan OpenAI client
const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Funktio, joka ottaa frontista käyttäjän viestin ja lähettää sen ChatGPT:lle ja saa botin vastauksen takaisin
const chatgpt = (req, res, next) => {
  const { message } = req.body; // Haetaan viesti req.body:stä

  openai.chat.completions.create({
    messages: [{ role: "system", content: message }], // Käytetään saapunutta viestiä
    model: "gpt-3.5-turbo",
  })
  .then(completion => {
    // Haetaan vastaus choices-objektin message-kentästä
    const response = completion.choices[0].message.content;
    console.log(response)
    res.json({ response }); // Lähetetään vastaus JSON-muodossa takaisin Frontendiin
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' }); // Palautetaan virheviesti
  });
};

export default chatgpt;