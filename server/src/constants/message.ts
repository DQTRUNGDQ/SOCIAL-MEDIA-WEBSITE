export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Name length must be from 1 to 50',
  EMAIL_ALREADY_EXISTS: 'Email already exist',
  EMAIL_IS_REQUIRE: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  USER_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_15: 'Password length must be from 5 to 15',
  PASSWORD_MUST_BE_STRONG:
    'Password must be 8-15 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_15: 'Confirm password length must be from 5 to 15',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Password must be 8-15 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be 8601',
  LOGIN_SUCCESS: 'Login Success',
  REGISTER_SUCCESS: 'Register Success'
} as const
