*** Settings ***
Library     Browser    auto_closing_level=SUITE    # Sulje selain vasta, kun kaikki testit on ajettu
Resource    login_variables.resource    # tunnukset ja salasanat on tallennettu erilliseen resource tiedostoon

*** Variables ***
${BROWSER}    chromium    # muut vaihtoehdot: firefox, webkit
${URL}    http://127.0.0.1:3000/    # Sisältää esimerkkiweb-sovelluksia kirjautumisen testaamiseen


*** Test Cases ***
Oikea tunnus ja salasana
    [Documentation]  Testaa kirjautumisen oikealla tunnuksella ja salasanalla
    [Tags]  positive auth
    New Browser    ${BROWSER}    headless=false    # headless=true, jos et tarvitse GUI
    New Context    viewport={'width': 800, 'height': 600}
    New Page    ${URL}
    # Click    //a[.='row.gtr-uniform']    # Valitse sivulta Simple Form Auth
    Fill Text    //input[@id = 'email']    ${EMAIL}    # Syötä sähköposti
    Fill Secret    //input[@id='password']    $PASSWORD    # Syötä salasana
    Click    //input[@type='submit']    # Klikkaa Log in -nappulaa
    # Wait Until Page Contains    Olet kirjautunut sisään

    Click    css=.navbar-menu > a[href='tools.html']
    Sleep    2s
    Click    css=#avaaNappi1
    Sleep    4s
    Click    css:.modal-content .close
    Sleep    4s



