# Деплой на VPS (Timeweb Cloud) — always-on, свой домен, без холодных стартов

Итог: сайт работает 24/7 на своём домене по HTTPS, БД — локальный SQLite-файл на
сервере (быстро, ничего внешнего не нужно). Приложение держит живым `pm2`, перед
ним стоит `nginx`. Никаких «экранов сборки» при заходе — сборка делается один раз
при деплое.

Ориентир по цене: VPS ~300–500₽/мес + домен ~200₽/год. Оплата картой/СБП.

---

## 1. Создать сервер в Timeweb Cloud
1. timeweb.cloud → **Облачные серверы** → **Создать**.
2. ОС: **Ubuntu 24.04** (или 22.04).
3. Тариф: минимальный (1 vCPU, 1 ГБ RAM, ~10 ГБ SSD) — этого хватает.
4. Создай и запомни **root-пароль** (или добавь свой SSH-ключ).
5. После создания запиши **публичный IP** сервера.

## 2. Домен
1. Купи домен (можно прямо в Timeweb: **Домены** → подобрать `.ru`).
2. В DNS домена добавь записи **A**:
   - `@` → IP сервера
   - `www` → IP сервера
3. Распространение DNS — от нескольких минут до пары часов.

## 3. Подключиться к серверу
С Windows проще через **PowerShell**:
```powershell
ssh root@ВАШ_IP
```
(введи root-пароль).

## 4. Установить ПО (один раз)
```bash
apt update && apt -y upgrade
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt -y install nodejs git nginx certbot python3-certbot-nginx
npm install -g pm2
# фаервол (если включён в панели Timeweb — открой там порты 22, 80, 443)
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable
```

## 5. Забрать код
```bash
git clone https://github.com/Loynis123/Cyber.git cyber
cd cyber
```
> Если репозиторий приватный — либо сделай его публичным на время клонирования,
> либо клонируй с токеном: `git clone https://<TOKEN>@github.com/Loynis123/Cyber.git cyber`.

## 6. Секрет (.env)
```bash
printf 'NODE_ENV=production\nPORT=3001\nJWT_SECRET=%s\n' \
  "$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")" > .env
```
Это создаёт `.env` со случайным `JWT_SECRET`. БД-переменные не нужны — приложение
само создаст файл `server/data/cyber.db` и засеет каталог при первом старте.

## 7. Собрать и запустить
```bash
bash deploy/setup.sh
pm2 startup        # выполни команду, которую он напечатает (для автозапуска после ребута)
pm2 save
```
Приложение теперь крутится на `127.0.0.1:3001`.

## 8. nginx + домен
```bash
cp deploy/nginx.conf.example /etc/nginx/sites-available/cyber
nano /etc/nginx/sites-available/cyber     # замени example.ru на свой домен (2 места)
ln -s /etc/nginx/sites-available/cyber /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```
Открой `http://твой-домен` — должен показаться сайт.

## 9. HTTPS (бесплатно)
```bash
certbot --nginx -d твой-домен -d www.твой-домен
```
Соглашайся на редирект HTTP→HTTPS. Сертификат продлевается автоматически.

Готово: `https://твой-домен` работает постоянно, быстро, без холодных стартов.

---

## Обновление сайта в будущем
Когда меняется код в репозитории:
```bash
cd ~/cyber && bash deploy/redeploy.sh
```
Это подтянет изменения, пересоберёт и перезапустит. **База данных
(`server/data/cyber.db`) не трогается** — пользователи и заказы сохраняются.

## Полезное
- Логи: `pm2 logs cyber-store`
- Статус: `pm2 status`
- Перезапуск: `pm2 restart cyber-store`
- Резервная копия БД: скопируй файл `~/cyber/server/data/cyber.db`.
