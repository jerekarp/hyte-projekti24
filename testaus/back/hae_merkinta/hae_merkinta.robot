*** Settings ***
Library          RequestsLibrary
Library          Collections
Resource         hae_merkinta_keywords.resource
Suite Setup     Authenticate as Admin


*** Test Cases ***
Login test
    [Documentation]    Authenticate and verify status code
    ${response}=    Authenticate as Admin
    Status Should Be    200    ${response}
    Log    Authentication successful


Get entry
    [Documentation]    Get a diary entry
    ${headers}=        Create Dictionary    Authorization=Bearer ${TOKEN}
    ${response}=       GET    http://127.0.0.1:3000/api/entries/118    headers=${headers}
    Status Should Be    200    ${response}
    Log    ${response}
    ${result}=         Convert To Dictionary    ${response.json()}
