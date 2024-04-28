*** Settings ***
Library         RequestsLibrary
Library         Collections
Library         OperatingSystem
Library         BuiltIn
Resource        openai.resource


*** Test Cases ***
Test OpenAI API Key
    ${headers}=     Create Dictionary   Authorization=Bearer ${API_KEY}
    ${body}=        Create Dictionary   input=Testataan, että toimiiko tämä APIKEY
    ${response}=    POST    https://api.openai.com/v1/moderations    headers=${headers}    json=${body}
    Should Be Equal As Strings    ${response.status_code}    200