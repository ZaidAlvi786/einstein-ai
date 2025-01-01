const V1_API = '/api/v1/';
const USER = `${V1_API}users`;
const PROPERTY = `${V1_API}property`;
const CONTACTS = '/contacts';
const UNITS = '/unit';
const UNITS_MODELS = '/unit_models';
const UNITS_MODEL = '/unit_model';
const UNITS_TO_MODEL = '/add_unit_to_model';
const UNITS_MODEL_BULK = '/bulk-update';
const APPLICATIONS = 'applications';
const AUTH_GOOGLE = `${V1_API}users/auth/google`;
const STATUS = 'status';
const MOVE_UNITS_TO_MODEL = '/move_units_to_model';
const SINGLE_UNITS_MODEL = '/get_single_unit_models';
const MULTI_UNITS_MODEL = '/get_multiple_unit_models';

export const API = {
  SIGNUP: {
    GET_STARTED: `${USER}/signup`,
    VERIFY_EMAIL_CODE: `${USER}/verify/email/code`,
    PORTFOLIO: `${USER}/portfolio`,
    PHONE_SEND_OTP: `${USER}/phone/send-otp`,
    PHONE_VERIFY_OTP: `${USER}/phone/verify-otp`,
    Email_RESEND_OTP: `${USER}/resend-otp`,
    PHONE_RESEND_OTP: `${USER}/phone/send-otp`,
    ADD_PHONE_NUMBER: `${USER}/add/phone-no`,
  },
  LOGIN: `${USER}/login`,

  PROPERTY: {
    CREATE: `${PROPERTY}`,
    UPDATE: `${PROPERTY}`,
    GET: `${PROPERTY}`,
    DELETE: `${PROPERTY}`,
  },
  CONTACTS: {
    CREATE: `${CONTACTS}`,
    UPDATE: `${CONTACTS}`,
    GET: `${CONTACTS}`,
    GET_BY_PROPERTY: `${CONTACTS}/property-contact`,
  },
  UNITS: {
    CREATE: `${UNITS_MODEL}`,
    GET: `${UNITS}`,
    UPDATE: `${UNITS_MODEL}`,
    DELETE: `${UNITS_MODEL}`,
    GET_MULTIPLE_MODEL: `${UNITS_MODELS}`,
    GET_UNITS_BY_PROPERTY: `${UNITS_MODELS}`,
    UPDATE_BULK: `${UNITS}${UNITS_MODEL_BULK}`,
    MOVE_UNITS_TO_MODEL: `${MOVE_UNITS_TO_MODEL}`,
    UNITS_TO_MODEL: `${UNITS_TO_MODEL}`,
    SINGLE_UNITS_MODEL: `${UNITS_MODELS}${SINGLE_UNITS_MODEL}`,
    MULTI_UNITS_MODEL: `${UNITS_MODELS}${MULTI_UNITS_MODEL}`,
  },

  GOOLE_AUTH: {
    GOOGLE_URL: `${AUTH_GOOGLE}/url`,
    CALLBACK: `${AUTH_GOOGLE}/callback`,
  },
  APPLICATIONS: {
    GET: `${V1_API}${APPLICATIONS}`,
    STATUS: `${V1_API}${APPLICATIONS}/${STATUS}`,
    CREATE: `${APPLICATIONS}`,
  },
};
