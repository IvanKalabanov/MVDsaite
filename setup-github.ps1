# Скрипт для настройки GitHub remote и пуша кода
# Использование: .\setup-github.ps1 -RepoUrl "https://github.com/YOUR_USERNAME/REPO_NAME.git"

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

Write-Host "Настройка GitHub remote..." -ForegroundColor Green

# Проверяем, что мы в git репозитории
if (-not (Test-Path .git)) {
    Write-Host "Ошибка: это не git репозиторий!" -ForegroundColor Red
    exit 1
}

# Проверяем, есть ли уже remote
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Найден существующий remote: $existingRemote" -ForegroundColor Yellow
    $response = Read-Host "Заменить на новый? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        git remote remove origin
    } else {
        Write-Host "Отменено." -ForegroundColor Yellow
        exit 0
    }
}

# Добавляем remote
Write-Host "Добавляем remote: $RepoUrl" -ForegroundColor Cyan
git remote add origin $RepoUrl

# Переименовываем ветку в main (если нужно)
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "Переименовываем ветку в main..." -ForegroundColor Cyan
    git branch -M main
}

# Показываем статус
Write-Host "`nТекущий статус:" -ForegroundColor Green
git status

Write-Host "`nГотово к пушу! Выполните:" -ForegroundColor Green
Write-Host "  git push -u origin main" -ForegroundColor Yellow

