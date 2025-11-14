// Моковые данные для замены API и локального состояния
export const mockUsers = [
  {
    id: 1,
    name: 'Администратор системы',
    login: 'admin',
    role: 'admin',
    department: 'Штаб',
    lastActive: '2024-01-15',
    password: 'admin123'
  },
  {
    id: 2,
    name: 'Руководитель ОУР',
    login: 'leader',
    role: 'leader',
    department: 'ОУР',
    lastActive: '2024-01-15',
    password: 'leader123'
  },
  {
    id: 3,
    name: 'Сотрудник ППСП',
    login: 'employee',
    role: 'employee',
    department: 'ППСП',
    lastActive: '2024-01-14',
    password: 'employee123'
  },
  {
    id: 4,
    name: 'Гражданин',
    login: 'user',
    role: 'user',
    department: '-',
    lastActive: '2024-01-13',
    password: 'user123'
  },
  {
    id: 5,
    name: 'Иванов А.С.',
    login: 'ivanov',
    role: 'leader',
    department: 'Штаб',
    lastActive: '2024-01-15',
    password: 'password123'
  },
  {
    id: 6,
    name: 'Петрова М.К.',
    login: 'petrova',
    role: 'leader',
    department: 'ОУР',
    lastActive: '2024-01-15',
    password: 'password123'
  },
  {
    id: 7,
    name: 'Сидоров В.П.',
    login: 'sidorov',
    role: 'employee',
    department: 'ОУР',
    lastActive: '2024-01-14',
    password: 'password123'
  },
  {
    id: 8,
    name: 'Козлов Д.И.',
    login: 'kozlov',
    role: 'employee',
    department: 'ППСП',
    lastActive: '2024-01-14',
    password: 'password123'
  },
  {
    id: 9,
    name: 'Николаев С.М.',
    login: 'nikolaev',
    role: 'employee',
    department: 'ППСП',
    lastActive: '2024-01-13',
    password: 'password123'
  }
];

export const mockNews = [
  {
    id: 1,
    title: 'Обновление системы МВД',
    excerpt: 'Внедрена новая система управления правоохранительной организацией',
    content: 'Сегодня была запущена обновленная версия системы МВД Enter Project. Теперь граждане могут подавать заявления онлайн, а сотрудники имеют доступ к расширенным функциям работы с базой данных.',
    image: 'https://via.placeholder.com/400/200?text=News+1',
    author: 'Администратор',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Набор новых сотрудников',
    excerpt: 'Объявлен конкурс на замещение вакантных должностей',
    content: 'МВД объявляет о наборе сотрудников в отделы ОУР и ППСП. Требования: высшее образование, отсутствие судимости, физическая подготовка.',
    image: 'https://via.placeholder.com/400/200?text=News+2',
    author: 'Руководство ОУР',
    date: '2024-01-14'
  }
];

const createTimestamp = (value) => ({
  createdAt: value,
  created_at: value
});

export const mockApplications = [
  {
    id: 1,
    type: 'Заявление о преступлении',
    title: 'Кража имущества',
    author: 'Гражданин',
    author_login: 'user',
    status: 'новое',
    priority: 'высокий',
    department: 'ОУР',
    description: 'Сообщаю о краже личного имущества из автомобиля',
    ...createTimestamp('2024-01-15 10:30:00'),
    responses: []
  },
  {
    id: 2,
    type: 'Обращение к руководству',
    title: 'Вопрос по работе отдела',
    author: 'Сидоров В.П.',
    author_login: 'sidorov',
    status: 'в работе',
    priority: 'средний',
    department: 'ОУР',
    description: 'Прошу разъяснить порядок обработки заявлений',
    ...createTimestamp('2024-01-14 15:45:00'),
    responses: [
      {
        id: 1,
        author: 'Петрова М.К.',
        text: 'Заявление принято в работу',
        ...createTimestamp('2024-01-14 16:00:00'),
        is_official: 1,
        isOfficial: true
      }
    ]
  }
];

export const mockDatabaseRecords = [
  {
    id: 1,
    fullName: 'Иванов Иван Иванович',
    birthDate: '1985-05-10',
    document: '4512 123456',
    caseNumber: 'ОУР-2024-001',
    caseType: 'Уголовное',
    status: 'Расследование',
    department: 'ОУР',
    officer: 'Петрова М.К.',
    address: 'г. Москва, ул. Центральная, 12',
    phone: '+7 (900) 123-45-67',
    description: 'Расследование дела о нарушении'
  },
  {
    id: 2,
    fullName: 'Петров Петр Петрович',
    birthDate: '1990-11-22',
    document: '4512 654321',
    caseNumber: 'ППСП-2024-015',
    caseType: 'Административное',
    status: 'Завершено',
    department: 'ППСП',
    officer: 'Сидоров В.П.',
    address: 'г. Москва, ул. Южная, 7',
    phone: '+7 (900) 765-43-21',
    description: 'Нарушение общественного порядка'
  }
];

export const mockEmployees = [
  {
    id: 1,
    name: 'Иванов А.С.',
    full_name: 'Иванов А.С.',
    rank: 'Полковник',
    position: 'Начальник штаба',
    department: 'Штаб',
    phone: 'internal-001',
    badge_number: 'МВД-001',
    start_date: '2020-01-15',
    status: 'Активный'
  },
  {
    id: 2,
    name: 'Петрова М.К.',
    full_name: 'Петрова М.К.',
    rank: 'Подполковник',
    position: 'Начальник ОУР',
    department: 'ОУР',
    phone: 'internal-002',
    badge_number: 'МВД-002',
    start_date: '2021-03-20',
    status: 'Активный'
  },
  {
    id: 3,
    name: 'Сидоров В.П.',
    full_name: 'Сидоров В.П.',
    rank: 'Капитан',
    position: 'Старший оперуполномоченный',
    department: 'ОУР',
    phone: 'internal-010',
    badge_number: 'МВД-010',
    start_date: '2022-05-12',
    status: 'Активный'
  },
  {
    id: 4,
    name: 'Жуков И.К.',
    full_name: 'Жуков И.К.',
    rank: 'Старший сержант',
    position: 'Инспектор ППСП',
    department: 'ППСП',
    phone: 'internal-021',
    badge_number: 'МВД-021',
    start_date: '2023-02-10',
    status: 'Активный'
  },
  {
    id: 5,
    name: 'Морозов Е.Г.',
    full_name: 'Морозов Е.Г.',
    rank: 'Майор',
    position: 'Руководитель следственного отдела',
    department: 'СО',
    phone: 'internal-030',
    badge_number: 'МВД-030',
    start_date: '2019-09-01',
    status: 'Активный'
  },
  {
    id: 6,
    name: 'Рахимова Л.Р.',
    full_name: 'Рахимова Л.Р.',
    rank: 'Капитан',
    position: 'Старший участковый',
    department: 'УУП',
    phone: 'internal-044',
    badge_number: 'МВД-044',
    start_date: '2020-06-18',
    status: 'Активный'
  },
  {
    id: 7,
    name: 'Демин А.В.',
    full_name: 'Демин А.В.',
    rank: 'Подполковник',
    position: 'Начальник УСБ',
    department: 'УСБ',
    phone: 'internal-060',
    badge_number: 'МВД-060',
    start_date: '2018-11-05',
    status: 'Командировка'
  }
];

export const mockLeaders = [
  {
    id: 1,
    name: 'Иванов А.С.',
    full_name: 'Иванов А.С.',
    position: 'Начальник штаба',
    department: 'Штаб',
    bio: 'Опытный руководитель с 15-летним стажем',
    contacts: '+7 (495) 000-10-01, каб. 401',
    photo: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=640&q=60'
  },
  {
    id: 2,
    name: 'Петрова М.К.',
    full_name: 'Петрова М.К.',
    position: 'Начальник ОУР',
    department: 'ОУР',
    bio: 'Специалист по оперативной работе',
    contacts: '+7 (495) 000-10-22, каб. 215',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=640&q=60'
  },
  {
    id: 3,
    name: 'Демин А.В.',
    full_name: 'Демин А.В.',
    position: 'Начальник УСБ',
    department: 'УСБ',
    bio: 'Курирует вопросы внутренней безопасности и контроля',
    contacts: '+7 (495) 000-42-15, шифр 120',
    photo: 'https://images.unsplash.com/photo-1522199992901-9e1c61136cc5?auto=format&fit=crop&w=640&q=60'
  }
];

export const mockStats = {
  employees: mockEmployees.length,
  applications: mockApplications.length,
  inProgress: mockApplications.filter(app => app.status === 'в работе').length,
  database: mockDatabaseRecords.length
};

// Уволенные сотрудники (по умолчанию пусто, будет заполняться при удалении из основного списка)
export const mockFiredEmployees = [];

// Автопарк МВД (по умолчанию небольшой набор техники, привязанной к подразделениям)
export const mockFleet = [
  {
    id: 1,
    department: 'ППСП',
    type: 'Патрульный автомобиль',
    model: 'Ford Crown Victoria',
    plate: 'МВД 001',
    status: 'В строю',
    notes: 'Основной патрульный экипаж'
  },
  {
    id: 2,
    department: 'ОУР',
    type: 'Опер. автомобиль',
    model: 'Toyota Camry',
    plate: 'МВД 010',
    status: 'В ремонте',
    notes: 'Требуется замена тормозных колодок'
  },
  {
    id: 3,
    department: 'СО',
    type: 'Следственная группа',
    model: 'Mercedes Vito',
    plate: 'МВД 020',
    status: 'В строю',
    notes: 'Используется для выезда СО на место происшествия'
  }
];