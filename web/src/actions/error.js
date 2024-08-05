export const SHOW_MESSAGE = "SHOW_MESSAGE";
export const HIDE_MESSAGE = "HIDE_MESSAGE";

export const showMessage = errorMessage => ({
  type: SHOW_MESSAGE,
  errorMessage
});
export const hideMessage = () => ({
  type: HIDE_MESSAGE
});
