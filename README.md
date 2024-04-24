# ZenBeat 

ZenBeat on stressinseurantasovellus, jonka käyttöön vaaditaan Kubios-tili, koska HRV-data haetaan Kubioksesta. 
Nodejs + Express sovellus.

### Projekti: Terveyssovelluksen kehitys, Metropolia Ammattikorkeakoulu
**Ryhmä 5**

> [!NOTE] 
> - [Linkki sovelluksen verkkosivulle](https://zenbeat.northeurope.cloudapp.azure.com/)
> - Linkki sovelluksen API-dokumentaatioon
> - [Sovelluksen rautalankamallit](https://imgur.com/a/9DV8Moe)


***Tietokannan kuva tähän***

# Käyttö

1. Kloonaa/lataa koodi
2. Suorita npm i projektikansiossa
3. Asenna ja käynnistä MySQL/MariaDB-palvelin
4. Tuo tietokannan skriptit db/ kansioon
5. Luo .env-tiedosto .env.sample-pohjan perusteella
6. Käynnistä kehityspalvelin: npm run dev / npm start

> [!NOTE]
> ZenBot käyttää OpenAI Api avainta. Se täytyy itse luoda OpenAI verkkosivulta, jotta sitä voi käyttää.



# Automaatiotestaukset


**UC_2 Kirjautuminen sovellukseen**

- [Login Report](https://jerekarp.github.io/)
- [Login Log](https://jerekarp.github.io/login_log.html)

---

**UC_3 Sovelluksen käyttö-ohjeisiin perehtyminen**

- [User Manual Report](https://jerekarp.github.io/user_manual_report.html)
- [User Manual Log](https://jerekarp.github.io/user_manual_log.html)

---

**UC_4 Sovelluksen käyttäjän esitietojen täyttäminen**

- [Esitietojen täyttö Report](https://jerekarp.github.io/esitiedot-report.html)
- [Esitietojen täyttö Log](https://jerekarp.github.io/esitiedot-log.html)

---

**UC_6 HRV-datan tarkastelu**

- [Data Analysis Report](https://jerekarp.github.io/data_analysis_report.html)
- [Data Analysis Log](https://jerekarp.github.io/data_analysis_log.html)

---

**UC_7 Päiväkirjamerkintöjen lisääminen**

- [Diary Report](https://jerekarp.github.io/diary-report.html)
- [Diary Log](https://jerekarp.github.io/diary-log.html)

---

**UC_9 Stressinhalinta-työkaluihin perehtyminen**

- [Tools Report](https://jerekarp.github.io/tools_report.html)
- [Tools Log](https://jerekarp.github.io/tools_log.html)

---

**UC_10 Uloskirjautuminen**

- [LogOut Report](https://jerekarp.github.io/logout_report.html)
- [LogOut Log](https://jerekarp.github.io/logout_log.html)

---

# Referenssit

- [Kirjautumissivun HTML5 pohja](https://html5up.net/highlights) | html5up.net | **@ajlkn**
- [Footer](https://www.codewithfaraz.com/content/271/create-an-animated-footer-with-html-and-css-source-code)
- Taustakuvat GPT-4.0
- ZenBot käytettiin OpenAI Api 
- Etusivun motivaatiolauseet [type.fit Api](https://forum.freecodecamp.org/t/free-api-inspirational-quotes-json-with-code-examples/311373)
- Ikonit [flaticonista](https://www.flaticon.com/)