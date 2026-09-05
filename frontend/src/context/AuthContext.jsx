/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useReducer } from 'react';

const getInitialUser = () => {
  try {
    const raw = localStorage.getItem('user');
    if (!raw || raw === 'undefined' || raw === 'null') return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to parse user from localStorage:', e);
    return null;
  }
};

const getInitialToken = () => {
  const t = localStorage.getItem('token');
  if (!t || t === 'null' || t === 'undefined') return null;
  return t;
};

const getInitialRole = () => {
  const r = localStorage.getItem('role');
  if (!r || r === 'null' || r === 'undefined') return null;
  return r;
};

const initialState = {
  user: getInitialUser(),
  role: getInitialRole(),
  token: getInitialToken(),
};

export const authContext = createContext(initialState);

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        user: null,
        role: null,
        token: null,
      };

    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        role: action.payload.role,
      };

    case 'LOGOUT':
      return {
        user: null,
        token: null,
        role: null,
      };

    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }

    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }

    if (state.role) {
      localStorage.setItem('role', state.role);
    } else {
      localStorage.removeItem('role');
    }
  }, [state]);

  const { user, token, role } = state;
  return (
    <authContext.Provider value={{ user, token, role, dispatch }}>
      {children}
    </authContext.Provider>
  );
};