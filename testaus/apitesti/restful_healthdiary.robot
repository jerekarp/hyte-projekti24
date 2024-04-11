
*** Settings ****
Library    RequestsLibrary
Library    Collections
Resource   restful_healthdiary_keywords.resource
Suite Setup    Authenticate as Admin

*** Test Cases ***
Login test
    [Documentation]    Authenticate and verify status code
    ${response}=    Authenticate as Admin
    Check Response Status Code Should Be 200    ${response}
    Log    Authentication successful


Fetch Diary Entries
    [Documentation]    Get diary entries
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${response}=    GET    https://healthdiary.northeurope.cloudapp.azure.com/api/entries    headers=${headers}
    Check Response Status Code Should Be 200    ${response}
    ${entries}=    Set Variable    ${response.json()}
    Log    ${entries}

