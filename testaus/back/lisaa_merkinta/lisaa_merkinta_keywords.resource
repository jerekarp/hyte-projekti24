*** Keywords ***
Authenticate as Admin
    ${body}    Create Dictionary    username=  password=
    ${response}    POST    url=http://127.0.0.1:3000/api/auth/login  json=${body}
    Log    ${response.json()}
    ${TOKEN}    Set Variable    ${response.json()}[token]
    Log    ${TOKEN}
    Set Suite Variable    ${TOKEN}
