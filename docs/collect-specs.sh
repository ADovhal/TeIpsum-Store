#!/bin/bash
set -e
mkdir -p specs

declare -A urls=(
  [auth]="http://localhost:22093/v3/api-docs"
  [user]="http://localhost:22094/v3/api-docs"
  [catalog]="http://localhost:22096/v3/api-docs"
  [order]="http://localhost:22001/v3/api-docs"
  [admin-product]="http://localhost:22095/v3/api-docs"
)

for svc in "${!urls[@]}"; do
  url=${urls[$svc]}
  echo "🔗 Fetching $svc spec from $url..."

  for i in {1..10}; do
    if curl -sSf "$url" >/dev/null; then
      echo "✅ $svc is available"
      curl -sSf "$url" | jq '.servers = [{"url": "/"}]' > "specs/${svc}.json"
      break
    fi
    echo "⏳ Waiting $svc ($i/10)..."
    sleep 3
  done || echo "❌ $svc unavailable after 30 s"
done

# Генерация swagger-config.json
cat <<EOF > specs/swagger-config.json
{
  "urls": [
    {"url": "/api-docs/auth.json", "name": "Auth Service"},
    {"url": "/api-docs/user.json", "name": "User Service"},
    {"url": "/api-docs/catalog.json", "name": "Catalog Service"},
    {"url": "/api-docs/order.json", "name": "Order Service"},
    {"url": "/api-docs/admin-product.json", "name": "Admin Product Service"}
  ]
}
EOF