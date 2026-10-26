#!/usr/bin/env bash
# Ubuntu/Debian VPS'ni pizza-bot uchun tayyorlaydi va ishga tushiradi.
# Ishlatish: bash setup-server.sh <domen>   (domen yo'q bo'lsa: <IP>.sslip.io)
set -euo pipefail

DOMAIN="${1:?Domen kerak, masalan: 1.2.3.4.sslip.io}"
APP_DIR=/opt/pizza-bot
export DEBIAN_FRONTEND=noninteractive

# Node.js 20, nginx, certbot
if ! command -v node >/dev/null || [ "$(node -v | cut -d. -f1 | tr -d v)" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
apt-get install -y nginx certbot python3-certbot-nginx rsync

# Bog'liqliklar va build
cd "$APP_DIR"
sed -i "s|^WEBAPP_URL=.*|WEBAPP_URL=https://$DOMAIN|; s|^DEV_LOGIN=.*|DEV_LOGIN=false|" .env
grep -q '^WEBAPP_URL=' .env || echo "WEBAPP_URL=https://$DOMAIN" >> .env
grep -q '^DEV_LOGIN=' .env || echo "DEV_LOGIN=false" >> .env
npm ci --omit=dev || npm install --omit=dev
npm ci --prefix miniapp && npm run build --prefix miniapp
npm ci --prefix admin && npm run build --prefix admin
npx prisma migrate deploy

# Doim ishlaydigan xizmat (qayta yuklanganda ham o'zi yonadi)
cat > /etc/systemd/system/pizza-bot.service <<EOF
[Unit]
Description=Pizza bot (API + Telegram bot)
After=network-online.target

[Service]
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/node src/index.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload
systemctl enable --now pizza-bot
systemctl restart pizza-bot

# nginx: tashqi https -> ichki 4000-port
PORT=$(grep -E '^PORT=' .env | cut -d= -f2 | tr -d '"' || true); PORT=${PORT:-4000}
cat > /etc/nginx/sites-available/pizza-bot <<EOF
server {
  listen 80;
  server_name $DOMAIN;
  client_max_body_size 6m;
  location / {
    proxy_pass http://127.0.0.1:$PORT;
    proxy_set_header Host \$host;
    proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;
  }
}
EOF
ln -sf /etc/nginx/sites-available/pizza-bot /etc/nginx/sites-enabled/pizza-bot
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# Bepul SSL sertifikat (Telegram Mini App https talab qiladi)
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email --redirect

if command -v ufw >/dev/null; then ufw allow OpenSSH; ufw allow 'Nginx Full'; fi

echo "TAYYOR: https://$DOMAIN"
