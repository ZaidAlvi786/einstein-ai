const api_protocol = process.env.NEXT_PUBLIC_API_PROTOCOL;
const origin = process.env.NEXT_PUBLIC_ORIGIN;
const apiURL = `${api_protocol}://${origin}/api`;
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const PAYMENT_MODE = process.env.NEXT_PUBLIC_PAYMENT_MODE;
const STRIPE_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const getWebSocketURL = (token) => {
  return `${api_protocol === "https" ? "wss" : "ws"}://${origin}/ws/global/?token=${token}`;
};

export { apiURL, GOOGLE_CLIENT_ID, PAYMENT_MODE, getWebSocketURL, STRIPE_PUBLISHABLE_KEY };