const OktaJwtVerifier = require('@okta/jwt-verifier');
const queryString = require('query-string');

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: process.env.ISSUER
});

module.exports = async function (context, req) {
    context.log('Processing Inline Hook', JSON.stringify(req.body));

    let assertion = undefined
    try {
        const url = req.body.data.context.request.url.value;
        const parsed = queryString.parse(url.split('?')[1]);
        assertion = await oktaJwtVerifier.verifyAccessToken(parsed.assertion,
            process.env.AUDIENCE)
    } catch (err) {
        context.log('Error validating assertion', err);
        assertion = err
    }
    let body = {
        "commands": [{
            "type": "com.okta.access.patch",
            "value": [{
                "op": "add",
                "path": "/claims/assertion",
                "value": assertion
            }]
        }]
    }
    context.res = {
        status: 200,
        body: JSON.stringify(body)
    }
};