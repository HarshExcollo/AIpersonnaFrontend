import { v4 as uuidv4 } from "uuid";

export function getSessionId(personaId: string): string {
  const key = `chat_session_id_${personaId}`;
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

export function startNewSession(personaId: string): string {
  const sessionId = uuidv4();
  const key = `chat_session_id_${personaId}`;
  localStorage.setItem(key, sessionId);
  return sessionId;
}