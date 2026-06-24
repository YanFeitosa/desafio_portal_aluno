const TOKEN_KEY = "@portal-aluno:token";
const SESSION_EXPIRED_EVENT = "@portal-aluno:session-expired";

export function saveAuthToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function removeAuthToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function notifySessionExpired() {
  window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
}

export function subscribeToSessionExpired(callback: () => void) {
  window.addEventListener(SESSION_EXPIRED_EVENT, callback);

  return () => {
    window.removeEventListener(SESSION_EXPIRED_EVENT, callback);
  };
}
