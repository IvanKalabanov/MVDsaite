# Инструкция по деплою на Vercel

## Шаг 1: Создайте репозиторий на GitHub (если еще не создан)

1. Перейдите на https://github.com/new
2. Создайте новый репозиторий (например, `MVDsaite`)
3. НЕ добавляйте README, .gitignore или лицензию (они уже есть в проекте)

## Шаг 2: Настройте remote и запушьте код

Выполните следующие команды в терминале:

```bash
# Добавьте remote (замените YOUR_USERNAME и REPO_NAME на ваши данные)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Или если используете SSH:
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Запушьте код
git branch -M main
git push -u origin main
```

## Шаг 3: Подключите проект к Vercel

### Вариант 1: Через веб-интерфейс Vercel

1. Перейдите на https://vercel.com
2. Войдите в аккаунт
3. Нажмите "Add New Project"
4. Импортируйте ваш GitHub репозиторий
5. Vercel автоматически определит настройки из `vercel.json`
6. Нажмите "Deploy"

### Вариант 2: Через Vercel CLI

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Войдите в Vercel
vercel login

# Задеплойте проект
vercel --prod
```

## Настройки проекта в Vercel

Проект уже настроен через `vercel.json`:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Rewrites настроены для SPA (React Router)

## После деплоя

После успешного деплоя Vercel предоставит вам URL вида:
`https://your-project-name.vercel.app`

Все изменения, которые вы будете пушить в `main` ветку, автоматически задеплоятся на Vercel.

## Проверка деплоя

После деплоя проверьте:
- ✅ Главная страница открывается
- ✅ Раздел "Руководство" показывает форму добавления с загрузкой фото
- ✅ Раздел "Сотрудники" показывает все 6 подразделений (Штаб, ОУР, ППСП, СО, УУП, УСБ)
- ✅ Звания отображаются от Курсанта до Полковника

