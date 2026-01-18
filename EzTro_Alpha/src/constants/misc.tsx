export const Misc = () => {
  const ERROR_MESSAGE = {
    FORBIDDEN: "Forbidden",
    NETWORK_ERROR: "Network Error",
    SERVER_ERROR: "Server Error",
    CLIENT_ERROR: "Client Error",
    INVALID_SESSION: "Invalid Session",
    ERROR: "Error",
  };

  const HTTP_STATUS_CODE = {
    INTERNAL_SERVER_ERROR: 500,
    BAD_REQUEST: 400,
    FORBIDDEN: 404,
    UNAUTHORIZED: 401,
  };

  const NUMBER = {
    ZERO: 0,
  };

  return {
    ERROR_MESSAGE,
    HTTP_STATUS_CODE,
    NUMBER,
  };
};
