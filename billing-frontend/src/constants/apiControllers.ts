/** API controller route segments (match ASP.NET [Route("api/{controller}")]). */
export const API_CONTROLLERS = {
  auth: 'auth',
  access: 'access',
  nameBoards: 'name-boards',
  trucks: 'trucks',
  drivers: 'drivers',
  menus: 'menus',
  screens: 'screens',
  health: 'health',
} as const;

export type ApiController = (typeof API_CONTROLLERS)[keyof typeof API_CONTROLLERS];
