const twofactor = require("node-2fa"); 

module.exports = function (app) {

    // credentials generated
    app.post('/token',         
        (req, res) => {
            
        if(req.headers.email === ''){
            res.status(400).json({ message: 'E-mail is required!' });
        }else{
            credential = generateToken(req.headers.email);        
            if(credential.token != undefined){            
                mailSent = sendMail(req.headers.email, "GET your 2FA token!", "<html><body><h1>Your 2FA token is: "+credential.token+" </h1></body></html>");
                res.status(200).json({ secret: credential.secret.secret, message: 'Token sent by mail!' }); 
            }else{
                res.status(500).json({ message: 'Error generating token!' });
            }
        }        
    })

    // token check
    app.post('/login', (req, res) => {
        if(req.headers.token === undefined){
            return res.status(400).json({ message: 'Token is required!!!' });
        }
        if (tokenValid(req.headers.token, req.headers.secret)) {
            return res.status(200).json({ message: 'Authorized!!!' });
        } else {
            return res.status(401).json({ message: 'Unauthorized, renew token and try again!!!' });
        }
    })

}

/**
 * Check if a token is valid within a certain time frame.
 *
 * @param {string} token - The token to be validated.
 * @param {string} secret - The secret key used to validate the token.
 * @return {boolean} Returns true if the token is valid within the time frame, otherwise returns false.
 */
function tokenValid(token, secret) {
    timeMinutesExpiration = 20; // in minutes

    comparation = twofactor.verifyToken(secret, token, timeMinutesExpiration);
    console.log(comparation);

    if(comparation === null){
        return false;
    }
    if(comparation.delta >= -timeMinutesExpiration && comparation.delta <= 0 ){
        return true;
    }else{
        return false;
    }    
}

/**
 * Generates a token for the given email.
 * @param {string} email - The email address.
 * @returns {string} - The generated token.
 */
function generateToken(email){
    newSecret = twofactor.generateSecret({ email: email});
    
    const newToken = twofactor.generateToken(newSecret.secret);
    console.log(newToken);

    return {"secret": newSecret, "token": newToken.token};
}

/**
 * Sends an email with the specified subject and content to the given email address.
 *
 * @param {string} email - The email address to send the email to.
 * @param {string} subject - The subject of the email.
 * @param {string} content - The content of the email.
 * @return {undefined} This function does not return a value.
 */
function sendMail(email, subject, content){
    brevo = require('@getbrevo/brevo');
    defaultClient = brevo.ApiClient.instance;

    apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = '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';

    apiInstance = new brevo.TransactionalEmailsApi();
    sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = subject; 
    sendSmtpEmail.htmlContent = content; 
    sendSmtpEmail.sender = { "name": "Backend", "email": Buffer.from("cm9naGVyX2NydXpAaG90bWFpbC5jb20=", 'base64').toString('ascii')};
    sendSmtpEmail.to = [
        { "email": email, "name": email }
    ];

    apiInstance.sendTransacEmail(sendSmtpEmail).then(function (data) {
        console.log('API called successfully. Returned data: ' + JSON.stringify(data));
    }, function (error) {
        console.error(error);
    });
}