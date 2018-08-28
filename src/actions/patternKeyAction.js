export const patternKeyAction = (patternkey) => {
    return {
      type: 'PATTERN_KEY',
      patternkey
    };
  };
  export const patternError = (error) => {
    return {
      type: 'ON_ERROR',
      error
    };
  };
  export const patternRegister = (isRegistered) => {
    return {
      type: 'ON_REGISTERED',
      isRegistered
    };
  };
  