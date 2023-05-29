const AWS = require('aws-sdk');
const AmazonCognitoId = require('amazon-cognito-identity-js');

// const request = require('request');
// const jwkToPem = require('jwk-to-pem');
// const jwt = require('jsonwebtoken');

const poolData = {
    UserPoolId:"eu-north-1_VMY2VtUlM",
    ClientId:"1s4ljp2ph9ldr32bir94ellfsg"
}
var unRegisteredUser;

const aws_region = 'eu-north-1';
// const cognitoUserPool = AmazonCognitoId.CognitoUserPool;
const userPool = new AmazonCognitoId.CognitoUserPool({
    UserPoolId:"eu-north-1_VMY2VtUlM",
    ClientId:"1s4ljp2ph9ldr32bir94ellfsg"
});

const signUp = (name, email, password) =>{
    console.log(name, email, password)
    return new Promise((result, reject) => {
    try{
        const attributeList = [];
        attributeList.push(
            new AmazonCognitoId.CognitoUserAttribute({Name:'name', Value: name})
        );
        attributeList.push(
            new AmazonCognitoId.CognitoUserAttribute({Name:'email', Value: email})
        );
        
    console.log(name, email, password)
        userPool.signUp(email, password, attributeList, null, (err, data)=>{
            if(err) reject(err)
            else result(data)
        })
        unRegisteredUser = result;
        // userPool.signUp(name, email, attributeList, null, function(err, result){
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     cognitoUser = result.user;
        //     console.log('user name is ' + cognitoUser.getUsername())})
    }catch(err){
        reject(err)
    }
})
}

const signIn = (name, password) => {
    console.log(name, password)
    return new Promise((resolve, reject) => {
        try{
            var authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
                Username: name,
                Password: password
            });
            var userData = {
                Username: name,
                Pool: userPool
            }
            var cognitoUser = new AmazonCognitoId.CognitoUser(userData);

            console.log(authenticationDetails)
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    resolve({ result
                    })
                    console.log('access token + ' + result.getAccessToken().getJwtToken());
                },
            
                onFailure: function(err) {
                    reject(err);
                },
                mfaRequired: function(codeDeliveryDetails) {
                    var verificationCode = prompt('Please input verification code' ,'');
                    cognitoUser.sendMFACode(verificationCode, this);
                }
            });

            // cognitoUser.authenticateUser(authenticationDetails, (err, data)=>{
            //     if(err) reject(err)
            //     else result(data)
            // })
        }catch(err){
            reject(err)
        }
    })
}

module.exports.verifyCode = (username, code)=>{
    return new Promise((resolve, reject) =>{
        const userPool = new AmazonCognitoId.CognitoUserPool(poolData)
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new AmazonCognitoId.CognitoUser(userData);
        cognitoUser.confirmRegistration(code, true, (error, result)=>{
            if(error){
                reject(error);
            }else {
                resolve(result);
            }
        })
    })
}

const change = (name, password, newpassword) => {
    console.log(name, password)
    return new Promise((resolve, reject) => {
        try{
            var authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
                Username: name,
                Password: password
            });
            var userData = {
                Username: name,
                Pool: userPool
            }
            var cognitoUser = new AmazonCognitoId.CognitoUser(userData);

            console.log(authenticationDetails)
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    cognitoUser.changePassword(password, newpassword, (err, result) =>{
                    if(err) reject(err)
                    else resolve({result})})
                },
            
                onFailure: function(err) {
                    reject(err);
                }
            });
        }catch(err){
            reject(err)
        }
    })
}

module.exports.delete = (name, password) => {
    console.log(name, password)
    return new Promise((resolve, reject) => {
        try{
            var authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
                Username: name,
                Password: password
            });
            var userData = {
                Username: name,
                Pool: userPool
            }
            var cognitoUser = new AmazonCognitoId.CognitoUser(userData);

            console.log(authenticationDetails)
            cognitoUser.authenticateUser(authenticationDetails, {
                onSuccess: function (result) {
                    cognitoUser.deleteUser((err, result)=>{
                        if(err){
                            reject(err)
                        }else {
                            resolve(result)
                        }
                    })
                },
            
                onFailure: function(err) {
                    reject(err);
                }
            });
        }catch(err){
            reject(err)
        }
    })
}

module.exports.forgotpwd = (name, password) => {
    console.log(name, password)
    return new Promise((resolve, reject) => {
        try{
            var authenticationDetails = new AmazonCognitoId.AuthenticationDetails({
                Username: name,
                Password: password
            });
            var userData = {
                Username: name,
                Pool: userPool
            }
            var cognitoUser = new AmazonCognitoId.CognitoUser(userData);

            console.log(authenticationDetails)
            cognitoUser.forgotPassword({Username: name}, {
                onSuccess: function (result) {
                    console.log('Please input verification code ' ,'');
                    // cognitoUser.deleteUser((err, result)=>{
                    //     if(err){
                    //         reject(err)
                    //     }else {
                    //         resolve(result)
                    //     }
                    // })
                },
                
                onFailure: function(err) {
                    reject(err);
                },
                // inputVerificationCode() {
                //     console.log('Please input verification code ' ,'');
                //     // var newPassword = prompt('Enter new password ' ,'');
                //     // cognitoUser.confirmPassword(verificationCode, newPassword, this);
                // }
            });
        }catch(err){
            reject(err)
        }
    })
}

module.exports.verifyCode = (username, password)=>{
    return new Promise((resolve, reject) =>{
        const userPool = new AmazonCognitoId.CognitoUserPool(poolData)
        const userData = {
            Username: username,
            Pool: userPool
        };
        const cognitoUser = new AmazonCognitoId.CognitoUser(userData);
        cognitoUser.forgotPassword({
            onSuccess: function (result){
                resolve(result)
                console.log('Pwd Changed successfully');
            },
            onFailure: function (err){
                reject(err)
            },
            inputVerification(){
                
            }
        })

        // .confirmRegistration(code, true, (error, result)=>{
        //     if(error){
        //         reject(error);
        //     }else {
        //         resolve(result);
        //     }
        // })
    })
}


module.exports.signUp = signUp;
module.exports.signIn = signIn;
module.exports.changePwd = change;

// module.exports.signUp = signUp;
// module.exports.signIn = signIn;