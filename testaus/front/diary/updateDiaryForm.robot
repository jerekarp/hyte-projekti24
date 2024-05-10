*** Settings ***
Library                 Browser    auto_closing_level=SUITE    # Sulje selain vasta, kun kaikki testit on ajettu    # robotcode: ignore
Resource                login_variables.resource    # tunnukset ja salasanat on tallennettu erilliseen resource tiedostoon


*** Variables ***
${BROWSER}           chromium
${URL}               http://127.0.0.1:3000/
${entry_id}          124

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
    Get Element    css=.day.current-date.dayMarked >> visible=true      # Valitsen päivämäärän (nykyhetkisen)
    Click    css=.day.current-date.dayMarked
    Sleep    2s



 # Muokka formin testaus
    Get Element    css=#updateButton[data-id='${entry_id}'] >> visible=true     # Hakee update nappi
    Click    css=#updateButton[data-id='${entry_id}']
    Sleep    2s

    ${entry_date}=    Set Variable    2024-05-10
    Fill Text    //input[@id= "updateEntryDate"]    ${entry_date}
    Sleep    2s

    ${mood}=        Set Variable     Surullinen
    Fill Text    //input[@id= "updateMood"]          ${mood}
    Sleep    2s

    ${stress_level}=    Set Variable    2
    Fill Text    //input[@id="updateStressLevel"]    ${stress_level}
    Sleep     2s

    ${weight}=          Set Variable       76
    Fill Text    //input[@id="updateWeight"]      ${weight}
    Sleep      2s


    ${sleep_hours}=      Set Variable    8
    Fill Text    //input[@id= "updateSleepHours" ]    ${sleep_hours}
    Sleep      2s


    ${notes}=          Set Variable      testitestitesti3
    Fill Text    //input[@id="updateNotes"]      ${notes}
    Sleep     2s

    Get Element    text=Päivitä merkintä >> visible=true
    Click    text=Päivitä merkintä


