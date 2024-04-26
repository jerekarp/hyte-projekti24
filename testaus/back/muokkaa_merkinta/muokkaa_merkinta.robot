*** Settings ***
Documentation     Test Case for updating a diary entry.
Library           RequestsLibrary
Library           Collections
Resource          muokkaa_merkinta_keywords.resource
Suite Setup     Authenticate as Admin

# *** Keywords ***
# Authenticate as Admin
#     ${body}    Create Dictionary    username=email  password=password
#     ${response}    POST    url=http://127.0.0.1:3000/api/auth/login  json=${body}
#     Log    ${response.json()}
#     ${TOKEN}    Set Variable    ${response.json()}[token]
#     Log    ${TOKEN}
#     Set Suite Variable    ${TOKEN}

*** Test Cases ***
Update Diary Entry
    [Documentation]    Updates a diary entry and verifies the update was successful.
    ${headers}=        Create Dictionary    Authorization=Bearer ${TOKEN}
    ${body}=           Create Dictionary    entry_date=2023-04-01    mood=happy    weight=70    sleep_hours=8    notes=Updated entry
    ${response}=       PUT    http://127.0.0.1:3000/api/entries/1    headers=${headers}    json=${body}
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
