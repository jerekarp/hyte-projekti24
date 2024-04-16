*** Settings ***
Library     Browser    auto_closing_level=SUITE
Library     CryptoLibrary    variable_decryption=True


*** Variables ***
${Username}     crypt:IHR7hUcofTZJTsgcSVJvzITWP855IUsNosNemseXPxFWkfC3L/uicHIeC7uJlbr/B076CLRsh0r/BUwMpgDDVFyWtDSWA5uIsw==
${Password}     crypt:4Xb/L3pvKPiWXMo8cDiRW3o+W5FE8CPYPpnCj2//71PrKpcu2EAcMjrr86D0jVaSmVOdS85r4EFwYXw=


*** Test Cases ***
Login with crypted variables
    New Browser    chromium    headless=No
    New Context    viewport={'width': 800, 'height': 600}
    New Page    http://127.0.0.1:3000/
    Type Text    //input[@id = 'email']    ${Username}    delay=0.1 s
    Type Secret    //input[@id='password']    $Password    delay=0.1 s
    Click    //input[@type='submit']    # Klikkaa Log in -nappulaa
    Sleep    2.0 s
