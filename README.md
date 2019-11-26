# Implementing OAuth 2.0 "On-Behalf-Of" flow with Inline Hooks
By using [Token Inline Hooks](https://developer.okta.com/docs/reference/token-hook/#see-also), we can be easily extend Okta to model the [OAuth 2.0 On-Behal-Of flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow).

When an API "A" requires a token to access API "B" (under the On-behalf-of flow), it can request the token using client_credentials flow; The request also passes the "assertion" (API "A"'s own JWT, JWT-A) as a query parameter. The inline hook:
* Re-validates the assertion. 
    * This sample is written in Node.js, so we use [Okta's Node.js jwt verifier](https://github.com/okta/okta-oidc-js/tree/master/packages/jwt-verifier)
* Performs custom policy evauation logic
* And if valid, patches the result back to the Auth Server's callback. The [`com.okta.access.patch` command](https://developer.okta.com/docs/reference/token-hook/#sample-response-to-add-a-claim) instructs Okta to extend the client_credentials' JWT with JWT-A's claims.

The diagram below describes the inline hook interaction:

![alt text](images/InlineHook_OBO_Flow.png)

# Setup

## Deploy the Azure Function to AWS:


|Variable|Value|
|--------|-----|
|ISSUER|Issuer String of the Authorization Server configured for API "B" (API "A" makes a client_credentials request to this auth server) e.g. `https://example.okta.com/oauth2/default`|
|AUDIENCE|"Audience" configured in the Authorization Server e.g. `api://default`|


## Setup Inline Hook
[Follow this guide](https://developer.okta.com/docs/concepts/inline-hooks/#inline-hook-setup) to complete the Okta Inline Hook setup.