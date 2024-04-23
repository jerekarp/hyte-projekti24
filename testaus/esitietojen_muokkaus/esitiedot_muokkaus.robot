*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     SeleniumLibrary
Resource    login_variables.resource

*** Variables ***
${BROWSER}      chromium
${URL}          http://127.0.0.1:3000/
${FIRSTNAME}    Robot
${LASTNAME}     Framework
${STUDENTNUMBER}    123456
${WEIGHT}       70
${HEIGHT}       180
${AGE}          20
${GENDER}       male

${NEW_FIRSTNAME}    Pekka
${NEW_LASTNAME}    Töpöhäntä
${NEW_STUDENTNUMBER}    654321
${NEW_WEIGHT}    72
${NEW_HEIGHT}    182
${NEW_AGE}    21
${NEW_GENDER}    female


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
    # Click    //select[@id='gender']    # Avaa sukupuoli-valikko
    # Select From List By Value    //select[@id='gender']    ${GENDER}
    Sleep    1
    Click    //input[@type='submit']

Muokkaa käyttäjätietoja
    [Documentation]    Tämä testi muokkaa käyttäjän tietoja käyttäen muokkausmodalia.
    [Tags]    edit info
    Click    css=#openEditModalBtn
    Sleep    1
    Fill Text    //input[@id='editFirstname']    ${NEW_FIRSTNAME}
    Fill Text    //input[@id='editLastname']    ${NEW_LASTNAME}
    Fill Text    //input[@id='editStudentnumber']    ${NEW_STUDENTNUMBER}
    Fill Text    //input[@id='editWeight']    ${NEW_WEIGHT}
    Fill Text    //input[@id='editHeight']    ${NEW_HEIGHT}
    Fill Text    //input[@id='editAge']    ${NEW_AGE}
    # Select From List By Value    //input[@id='editGender']    ${NEW_GENDER}
    Sleep    1
    Click    //input[@id='updateInfo']
    Sleep    2  # Tämä sleep antaa aikaa päivityksen käsittelylle palvelimella




