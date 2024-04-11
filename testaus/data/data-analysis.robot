*** Settings ***
Library     Browser    auto_closing_level=SUITE    # Sulje selain vasta, kun kaikki testit on ajettu
Resource    login_variables.resource    # tunnukset ja salasanat on tallennettu erilliseen resource tiedostoon

*** Variables ***
${BROWSER}    chromium    
${URL}    http://127.0.0.1:3000/    # testaan localhostin kautta projektin koodia, myöhemmin oikealla verkkosivulla (kun palvelin on luotu)


*** Test Cases ***
Kirjaudutaan sisään ja navigoidaan sovelluksen Data-sivulle
    [Documentation]  Kirjaudutaan sisään ja navigoidaan Data-sivulle
    [Tags]           login
    New Browser      ${BROWSER}    headless=false
    New Context      viewport={'width': 1400, 'height': 1080}
    New Page         ${URL}
    Fill Text        //input[@id = 'email']    ${EMAIL}
    Fill Secret      //input[@id='password']   $PASSWORD
    Click            //input[@type='submit']
    Click            css=.navbar-menu > a[href='data.html']
    Sleep            2s
    Click With Options           css=#chartSelection    delay=2s
    # Select From List by Label    id=chartSelection    Stressi






