import { backendUrl } from '../helpers/constants';

export const API_ROOT = `${backendUrl}`;
export const API_WS_ROOT = 'ws://localhost:3000/cable';
export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
