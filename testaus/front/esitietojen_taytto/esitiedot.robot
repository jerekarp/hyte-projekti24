*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     SeleniumLibrary
Resource    ../login_variables.resource

*** Variables ***
${BROWSER}      chromium
${URL}          https://zenbeat.northeurope.cloudapp.azure.com/
${FIRSTNAME}    Robot
${LASTNAME}     Framework
${STUDENTNUMBER}    123456
${WEIGHT}       70
${HEIGHT}       180
${AGE}          20
${GENDER}       male

*** Test Cases ***
Kirjautuminen sisään ja uuden käyttäjän esitieto-lomakkeen täyttäminen
    [Documentation]    Kirjaudutaan sisään sovellukseen Kubios-tunnuksella. Uudelle käyttäjälle (ei tietoa databasessa) aukee heti esitietojen täyttö lomake. Täytetään tiedot ja lähetetään tiedot.
    [Tags]    positive auth
    New Browser    ${BROWSER}    headless=false
    New Context    viewport={'width': 800, 'height': 600}
    New Page    ${URL}
    Fill Text    //input[@id = 'email']    ${EMAIL}
    Fill Secret    //input[@id='password']    $PASSWORD
    Click    //input[@type='submit']
    Fill Text    //input[@id='firstname']    ${FIRSTNAME}
    Fill Text    //input[@id='lastname']    ${LASTNAME}
    Fill Text    //input[@id='studentnumber']    ${STUDENTNUMBER}
    Fill Text    //input[@id='weight']    ${WEIGHT}
    Fill Text    //input[@id='height']    ${HEIGHT}
    Fill Text    //input[@id='age']    ${AGE}
    Click    //select[@id='gender']    # Avaa sukupuoli-valikko
    # Select From List By Value    //select[@id='gender']    male              
    Click    //input[@class='submit-button']

