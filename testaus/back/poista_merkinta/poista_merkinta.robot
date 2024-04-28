*** Settings ***
Library          RequestsLibrary
Library          Collections
Resource         poista_merkinta_keywords.resource

Suite Setup     Authenticate as Admin


*** Test Cases ***
Login test
    [Documentation]    Authenticate and verify status code
    ${response}=    Authenticate as Admin
    Check Response Status Code Should Be 200    ${response}
    Log    Authentication successful


Delete entry
    [Documentation]    Delete a diary entry
    ${headers}=        Create Dictionary    Authorization=Bearer ${TOKEN}
    ${response}=       DELETE    http://127.0.0.1:3000/api/entries/3    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response}
    ${result}=         Convert To Dictionary    ${response.json()}
