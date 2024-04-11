*** Settings ***
Library     Browser    auto_closing_level=SUITE    # Sulje selain vasta, kun kaikki testit on ajettu
Resource    login_variables.resource    # tunnukset ja salasanat on tallennettu erilliseen resource tiedostoon

*** Variables ***
${BROWSER}    chromium    # muut vaihtoehdot: firefox, webkit
${URL}    http://127.0.0.1:3000/    # Sisältää esimerkkiweb-sovelluksia kirjautumisen testaamiseen

*** Test Cases ***
Kirjautuminen ja sovelluksen käyttöohjeisiin tutustuminen
    [Documentation]  Testaa kirjautuminen oikeilla tunnuksilla
    New Browser    ${BROWSER}    headless=false    # headless=true, jos et tarvitse GUI
    New Context    viewport={'width': 800, 'height': 600}
    New Page    ${URL}
    Sleep    2
    Click    //a[@href='#footer' and contains(@class, 'nav-link')]    # Klikkaa "Kirjaudu"-painiketta
    Sleep   2
    Fill Text    //input[@id = 'email']    ${EMAIL}    # Syötä sähköposti
    Fill Secret    //input[@id='password']    $PASSWORD    # Syötä salasana
    Sleep    2
    Click    //input[@type='submit']    # Klikkaa Log in -nappulaa
    Sleep    2
    Click    //a[@href='about.html' and contains(@class, 'nav-link')]    #Klikkaa navigointipalkista "Info"-sivua
    Sleep    2
