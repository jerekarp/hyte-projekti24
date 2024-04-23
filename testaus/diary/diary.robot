*** Settings ***
Library                 Browser    auto_closing_level=SUITE    # Sulje selain vasta, kun kaikki testit on ajettu    # robotcode: ignore
Resource                login_variables.resource    # tunnukset ja salasanat on tallennettu erilliseen resource tiedostoon


*** Variables ***
${BROWSER}           chromium
${URL}               http://127.0.0.1:3000/    # testaan localhostin kautta projektin koodia, myöhemmin oikealla verkkosivulla (kun palvelin on luotu)


*** Test Cases ***
Kirjaudutaan sisään ja navigoidaan sovelluksen Diary-sivulle
    [Documentation]    Kirjaudutaan sisään ja navigoidaan Diary-sivulle
    [Tags]    login
    New Browser    ${BROWSER}    headless=false
    New Context    viewport={'width': 1400, 'height': 1080}
    New Page    ${URL}
    Fill Text    //input[@id = 'email']    ${EMAIL}
    Fill Secret    //input[@id='password']    $PASSWORD
    Click    //input[@type='submit']
    Click    css=.navbar-menu > a[href='diary.html']
    Sleep    2s


    # Formi testaus

    ${entry_date}=    Set Variable    2024-04-15
    Fill Text    //input[@name= "entry_date"]    ${entry_date}
    Sleep    2s

    ${mood}=        Set Variable     Iloinen
    Fill Text    //input[@name= "mood"]          ${mood}
    Sleep    2s

    Click       //Button[@data-mood= "Energinen"]
    Sleep    2s


    ${stress_level}=    Set Variable    10
    Fill Text    //input[@name="stress_level"]    ${stress_level}
    Sleep     2s


    ${sleep_hours}=      Set Variable    8
    Fill Text    //input[@name= "sleep_hours" ]    ${sleep_hours}
    Sleep      2s


    ${weight}=          Set Variable       66
    Fill Text    //input[@name="weight"]      ${weight}
    Sleep      2s


    ${notes}=          Set Variable      moimoi
    Fill Text    //textarea[@name="notes"]      ${notes}


    Click       //input[@type='submit']
    Sleep      2s
