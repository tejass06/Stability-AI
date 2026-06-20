const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ActionStep {
  number: number;
  title: string;
  description: string;
  badge: string;
  category: string;
  urgent: boolean;
  inactive: boolean;
  completed: boolean;
}

export interface PlanData {
  sessionId: string;
  actionSteps: ActionStep[];
  documentsNeeded: string[];
  rightsSummary: string;
  urgencyLevel: string;
  createdAt: string;
}

export interface ProgressData {
  sessionId: string;
  progress: Record<string, boolean>;
}

// Helpers for localStorage
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const getSessionId = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('sessionId');
  }
  return null;
};

const saveTokenAndSession = (token: string, sessionId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('sessionId', sessionId);
  }
};

export const clearSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('activeSessionId');
  }
};

export const logout = async (): Promise<void> => {
  const token = getToken();

  // Best-effort: tell backend to invalidate the session
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch {
      // Ignore network errors — we still clear local state
    }
  }

  // Always clear all local session data
  clearSession();
};


// Check for X-New-Token header to update local token if middleware auto-refreshed it
const handleNewTokenHeader = (headers: Headers) => {
  const newToken = headers.get('X-New-Token');
  if (newToken) {
    localStorage.setItem('token', newToken);
    console.log('Session token updated from backend header.');
  }
};

export const initSession = async (): Promise<{ token: string; sessionId: string }> => {
  const existingToken = getToken();
  const existingSessionId = getSessionId();

  if (existingToken && existingSessionId) {
    return { token: existingToken, sessionId: existingSessionId };
  }

  // Generate new anonymous session
  const res = await fetch(`${API_BASE_URL}/api/auth/session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('Failed to initialize anonymous session');
  }

  const data = await res.json();
  saveTokenAndSession(data.token, data.sessionId);
  return { token: data.token, sessionId: data.sessionId };
};

export const generatePlan = async (intakeData: {
  state: string;
  county: string;
  situation: string;
  daysUntilDeadline: number;
  income: number;
  householdSize: number;
}): Promise<PlanData> => {
  // Ensure we have a session initialized first
  await initSession();
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/plan/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(intakeData),
  });

  if (!res.ok) {
    throw new Error('Failed to generate action plan');
  }

  handleNewTokenHeader(res.headers);
  return res.json();
};

export const getPlan = async (sessionId: string): Promise<PlanData> => {
  await initSession();
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/plan/${sessionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch action plan');
  }

  handleNewTokenHeader(res.headers);
  return res.json();
};

export const getProgress = async (sessionId: string): Promise<ProgressData> => {
  await initSession();
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/progress/${sessionId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch progress tracker');
  }

  handleNewTokenHeader(res.headers);
  return res.json();
};

export const updateProgress = async (
  sessionId: string,
  stepNumber: number,
  completed: boolean
): Promise<{ message: string; progress: Record<string, boolean> }> => {
  await initSession();
  const token = getToken();

  const res = await fetch(`${API_BASE_URL}/api/progress/${sessionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ stepNumber, completed }),
  });

  if (!res.ok) {
    throw new Error('Failed to update progress');
  }

  handleNewTokenHeader(res.headers);
  return res.json();
};
