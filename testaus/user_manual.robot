*** Settings ***
Library     Browser    auto_closing_level=SUITE    # Sulje selain vasta, kun kaikki testit on ajettu
Resource    login_variables.resource    # tunnukset ja salasanat on tallennettu erilliseen resource tiedostoon

*** Variables ***
${BROWSER}    chromium    # muut vaihtoehdot: firefox, webkit
${URL}    http://127.0.0.1:3000/    # Sisältää esimerkkiweb-sovelluksia kirjautumisen testaamiseen


*** Test Cases ***

# Tänne UC_3 eli Käyttäjän tulee kirjautua sisään ja navigoida “info” välilehdelle, josta käyttöohjeet löytyvät
