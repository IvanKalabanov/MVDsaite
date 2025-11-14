// src/utils/api.js
// Реализация "бэкенда" на фронтенде через localStorage + моковые данные
import {
  mockUsers,
  mockNews,
  mockApplications,
  mockDatabaseRecords,
  mockEmployees,
  mockLeaders,
  mockStats,
  mockFiredEmployees,
  mockFleet
} from '../data/mockData';

const STORAGE_KEY = 'mvdsai-local-data';
const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

let memoryState = null;

const clone = (data) => (data === undefined ? undefined : JSON.parse(JSON.stringify(data)));

const withDefaults = (state = {}) => ({
  users: state.users?.length ? state.users : clone(mockUsers),
  news: state.news?.length ? state.news : clone(mockNews),
  applications: state.applications?.length ? state.applications : clone(mockApplications),
  database: state.database?.length ? state.database : clone(mockDatabaseRecords),
  employees: state.employees?.length ? state.employees : clone(mockEmployees),
  leaders: state.leaders?.length ? state.leaders : clone(mockLeaders),
  stats: state.stats || clone(mockStats),
  firedEmployees: state.firedEmployees?.length ? state.firedEmployees : clone(mockFiredEmployees),
  fleet: state.fleet?.length ? state.fleet : clone(mockFleet)
});

const loadState = () => {
  if (memoryState) return memoryState;

  if (isBrowser) {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        memoryState = withDefaults(JSON.parse(raw));
        return memoryState;
      }
    } catch (error) {
      console.warn('Не удалось прочитать сохранённые данные, используем значения по умолчанию.', error);
    }
  }

  memoryState = withDefaults();
  return memoryState;
};

const saveState = (state) => {
  memoryState = state;
  if (isBrowser) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Не удалось сохранить состояние в localStorage', error);
    }
  }
};

const mutateState = (mutator) => {
  const draft = clone(loadState());
  const result = mutator(draft);
  saveState(draft);
  return result;
};

const delay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));
const respond = async (value) => {
  await delay();
  return clone(value);
};

const sanitizeUser = (user) => {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
};

const resolveStats = (state) => ({
  employees: state.employees.length,
  applications: state.applications.length,
  inProgress: state.applications.filter(app => app.status === 'в работе').length,
  database: state.database.length
});

const ensureTimestamp = () => {
  const value = new Date().toLocaleString('ru-RU');
  return {
    createdAt: value,
    created_at: value
  };
};

// Авторизация
export const login = async (loginValue, password) => {
  const state = loadState();
  const user = state.users.find(u => u.login === loginValue);

  if (!user) {
    throw new Error('Пользователь не найден');
  }

  if (user.password && password !== user.password) {
    throw new Error('Неверный пароль');
  }

  user.lastActive = new Date().toISOString().split('T')[0];
  saveState(state);

  return respond({ user: sanitizeUser(user) });
};

export const register = async (name, loginValue, password, role = 'user') => {
  const created = mutateState((state) => {
    if (state.users.find(u => u.login === loginValue)) {
      throw new Error('Пользователь с таким логином уже существует');
    }

    const newUser = {
      id: Date.now(),
      name,
      login: loginValue,
      role,
      password,
      department: role === 'user' ? '-' : 'Штаб',
      lastActive: new Date().toISOString().split('T')[0]
    };

    state.users.push(newUser);
    return newUser;
  });

  return respond({ user: sanitizeUser(created) });
};

// Пользователи
export const getUsers = async () => {
  const state = loadState();
  return respond(state.users.map(sanitizeUser));
};

export const updateUserRole = async (userId, role) => {
  const updated = mutateState((state) => {
    const user = state.users.find(u => u.id === Number(userId));
    if (!user) throw new Error('Пользователь не найден');
    user.role = role;
    return user;
  });

  return respond(sanitizeUser(updated));
};

export const deleteUser = async (userId) => {
  mutateState((state) => {
    state.users = state.users.filter(u => u.id !== Number(userId));
  });
  return respond(true);
};

// Заявления
export const getApplications = async (params = {}) => {
  const state = loadState();
  const filtered = state.applications.filter(app => {
    if (params.id && Number(params.id) !== app.id) return false;
    if (params.author_login && app.author_login !== params.author_login) return false;
    if (params.status && app.status !== params.status) return false;
    return true;
  }).sort((a, b) => (new Date(b.createdAt || b.created_at)) - (new Date(a.createdAt || a.created_at)));

  return respond(filtered);
};

export const createApplication = async (applicationData) => {
  const created = mutateState((state) => {
    const timestamp = ensureTimestamp();
    const newApplication = {
      id: Date.now(),
      status: 'новое',
      priority: 'средний',
      responses: [],
      ...timestamp,
      ...applicationData
    };
    state.applications.push(newApplication);
    return newApplication;
  });

  return respond(created);
};

export const updateApplication = async (id, updates) => {
  const updated = mutateState((state) => {
    const application = state.applications.find(app => app.id === Number(id));
    if (!application) throw new Error('Заявление не найдено');
    Object.assign(application, updates);
    return application;
  });

  return respond(updated);
};

export const addApplicationResponse = async (applicationId, responseData) => {
  const updated = mutateState((state) => {
    const application = state.applications.find(app => app.id === Number(applicationId));
    if (!application) throw new Error('Заявление не найдено');
    const timestamp = ensureTimestamp();
    const response = {
      id: Date.now(),
      ...timestamp,
      ...responseData
    };
    application.responses = [...(application.responses || []), response];
    return application;
  });

  return respond(updated);
};

// Новости
export const getNews = async () => {
  const state = loadState();
  const news = [...state.news].sort((a, b) => new Date(b.date) - new Date(a.date));
  return respond(news);
};

export const createNews = async (newsData) => {
  const created = mutateState((state) => {
    const newNews = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ru-RU'),
      image: 'https://via.placeholder.com/400/200?text=News',
      ...newsData
    };
    state.news = [newNews, ...state.news];
    return newNews;
  });

  return respond(created);
};

export const deleteNews = async (newsId) => {
  mutateState((state) => {
    state.news = state.news.filter(n => n.id !== Number(newsId));
  });
  return respond(true);
};

// База данных нарушителей
export const getDatabaseRecords = async () => {
  const state = loadState();
  return respond(state.database);
};

export const createDatabaseRecord = async (recordData) => {
  const created = mutateState((state) => {
    const newRecord = {
      id: Date.now(),
      ...recordData
    };
    state.database.push(newRecord);
    return newRecord;
  });

  return respond(created);
};

export const updateDatabaseRecord = async (id, updates) => {
  const updated = mutateState((state) => {
    const record = state.database.find(item => item.id === Number(id));
    if (!record) throw new Error('Запись не найдена');
    Object.assign(record, updates);
    return record;
  });

  return respond(updated);
};

export const deleteDatabaseRecord = async (id) => {
  mutateState((state) => {
    state.database = state.database.filter(record => record.id !== Number(id));
  });
  return respond(true);
};

// Сотрудники
export const getEmployees = async () => {
  const state = loadState();
  return respond(state.employees);
};

export const createEmployee = async (employeeData) => {
  const created = mutateState((state) => {
    const newEmployee = {
      id: Date.now(),
      name: employeeData.full_name || employeeData.name,
      ...employeeData
    };
    state.employees.push(newEmployee);
    return newEmployee;
  });

  return respond(created);
};

export const updateEmployee = async (id, updates) => {
  const updated = mutateState((state) => {
    const employee = state.employees.find(emp => emp.id === Number(id));
    if (!employee) throw new Error('Сотрудник не найден');
    Object.assign(employee, updates);
    if (updates.full_name || updates.name) {
      employee.name = updates.full_name || updates.name;
    }
    return employee;
  });

  return respond(updated);
};

export const deleteEmployee = async (id) => {
  mutateState((state) => {
    const numericId = Number(id);
    const employee = state.employees.find(emp => emp.id === numericId);
    state.employees = state.employees.filter(emp => emp.id !== numericId);

    if (employee) {
      const firedRecord = {
        ...employee,
        firedAt: new Date().toLocaleDateString('ru-RU'),
        reason: employee.status === 'Неактивный' ? 'Уволен' : employee.status || 'Уволен'
      };
      state.firedEmployees = [...(state.firedEmployees || []), firedRecord];
    }
  });
  return respond(true);
};

// Уволенные сотрудники
export const getFiredEmployees = async () => {
  const state = loadState();
  return respond(state.firedEmployees || []);
};

export const deleteFiredEmployee = async (id) => {
  mutateState((state) => {
    const numericId = Number(id);
    state.firedEmployees = (state.firedEmployees || []).filter(emp => emp.id !== numericId);
  });
  return respond(true);
};

// Автопарк
export const getFleet = async () => {
  const state = loadState();
  return respond(state.fleet || []);
};

export const createFleetItem = async (itemData) => {
  const created = mutateState((state) => {
    const newItem = {
      id: Date.now(),
      ...itemData
    };
    state.fleet = [...(state.fleet || []), newItem];
    return newItem;
  });

  return respond(created);
};

export const updateFleetItem = async (id, updates) => {
  const updated = mutateState((state) => {
    const numericId = Number(id);
    const item = (state.fleet || []).find(car => car.id === numericId);
    if (!item) throw new Error('Транспорт не найден');
    Object.assign(item, updates);
    return item;
  });

  return respond(updated);
};

export const deleteFleetItem = async (id) => {
  mutateState((state) => {
    const numericId = Number(id);
    state.fleet = (state.fleet || []).filter(car => car.id !== numericId);
  });
  return respond(true);
};

// Руководители
export const getLeaders = async () => {
  const state = loadState();
  return respond(state.leaders);
};

export const createLeader = async (leaderData) => {
  const created = mutateState((state) => {
    const newLeader = {
      id: Date.now(),
      ...leaderData,
      photo: leaderData.photo || 'https://via.placeholder.com/200/200?text=Leader'
    };
    state.leaders.push(newLeader);
    return newLeader;
  });

  return respond(created);
};

export const updateLeader = async (id, updates) => {
  const updated = mutateState((state) => {
    const leader = state.leaders.find(item => item.id === Number(id));
    if (!leader) throw new Error('Руководитель не найден');
    Object.assign(leader, updates);
    return leader;
  });

  return respond(updated);
};

export const deleteLeader = async (id) => {
  mutateState((state) => {
    state.leaders = state.leaders.filter(leader => leader.id !== Number(id));
  });
  return respond(true);
};

// Статистика
export const getStats = async () => {
  const state = loadState();
  const stats = resolveStats(state);
  state.stats = stats;
  saveState(state);
  return respond(stats);
};

export default {
  login,
  register,
  getUsers,
  updateUserRole,
  deleteUser,
  getApplications,
  createApplication,
  updateApplication,
  addApplicationResponse,
  getNews,
  createNews,
  deleteNews,
  getDatabaseRecords,
  createDatabaseRecord,
  updateDatabaseRecord,
  deleteDatabaseRecord,
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getFiredEmployees,
  deleteFiredEmployee,
  getLeaders,
  createLeader,
  updateLeader,
  deleteLeader,
  getStats,
  getFleet,
  createFleetItem,
  updateFleetItem,
  deleteFleetItem
};
