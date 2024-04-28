*** Settings ***
Documentation     Test Case for adding a diary entry.
Library           RequestsLibrary
Library           Collections
Resource          lisaa_merkinta_keywords.resource
Suite Setup       Authenticate as Admin

*** Test Cases ***
Add Diary Entry
    [Documentation]    Adds a new diary entry and verifies that the addition was successful.
    ${headers}=        Create Dictionary    Authorization=Bearer ${TOKEN}
    ${body}=           Create Dictionary    entry_date=2023-04-01    mood=Iloinen    weight=74    sleep_hours=7    notes=Uusi päiväkirjamerkintä
    ${response}=       POST    http://127.0.0.1:3000/api/entries    headers=${headers}    json=${body}
    Status Should Be    201    ${response}
    Log    ${response}
    ${result}=         Convert To Dictionary    ${response.json()}

*** Keywords ***
Log In
    ${login_info}=     Create Dictionary    email=${EMAIL}    password=${PASSWORD}
    ${response}=       POST    ${BASE_URL}/login    json=${login_info}
    Set Suite Variable    ${TOKEN}    ${response.json()['token']}
    Log    ${TOKEN}

Log Out
    ${response}=       GET    ${BASE_URL}/logout    headers=${headers}
    Log    ${response}
