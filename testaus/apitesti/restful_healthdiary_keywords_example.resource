*** Keywords ***
Authenticate as Admin
    [Documentation]    Authenticate as admin and return response
    ${body}    Create Dictionary    username=usernamehere   password=passwordhere
    ${response}    POST    urlhere   json=${body}
    Log    ${response.json()}
    ${token}    Set Variable    ${response.json()}[token]
    Log    ${token}
    Set Suite Variable    ${token}
    [Return]    ${response}

Check Response Status Code Should Be 200
    [Arguments]    ${response}
    ${status_code}=    Set Variable    ${response.status_code}
    Should Be Equal As Strings    ${status_code}    200    # Check if status code is 200 (OK)

Check Response Status Code Should Be 401
    [Arguments]    ${response}
    ${status_code}=    Set Variable    ${response.status_code}
    Should Be Equal As Strings    ${status_code}    401    # Unauthorized
