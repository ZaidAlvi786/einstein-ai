const api_protocol = "https";
const origin = "api.einstein-chat.com";
const apiURL = `${api_protocol}://${origin}/api`;
// const GOOGLE_CLIENT_ID = "194646893446-tl8t6brep8vkbmg3k5u1kipb1ge6lt1o.apps.googleusercontent.com";
const GOOGLE_CLIENT_ID = "657492164834-6oei4mm1s3j2jnom7msg3afvo4956380.apps.googleusercontent.com";
const PAYMENT_MODE = "DEV";
const STRIPE_PUBLISHABLE_KEY = "pk_test_51OWRyMJ4x5C1LZLSPDWekgMBWVr8i2dnYxgz5iUPgFryqbeypQ47WRatVXMbir1ZJLLTz7dqy6sUJFdudp5MdMVJ00wquHWjB6";
const getWebSocketURL = (token) => {
    return (`${api_protocol === "https" ? "wss" : "ws"}://${origin}/ws/global/?token=${token}`);
}
export { apiURL, GOOGLE_CLIENT_ID, PAYMENT_MODE, getWebSocketURL, STRIPE_PUBLISHABLE_KEY };