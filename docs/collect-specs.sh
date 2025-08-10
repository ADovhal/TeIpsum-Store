#!/bin/bash
set -e
mkdir -p specs

declare -A ports=(
  [auth]=22093
  [user]=22094
  [catalog]=22096
  [order]=22001
  [admin-product]=22095
)

for svc in "${!ports[@]}"; do
  port=${ports[$svc]}
  url="http://localhost:${port}/v3/api-docs"
  echo "🔗 Checking $svc on port $port..."

  for i in {1..10}; do
    if curl -sSf "$url" >/dev/null; then
      echo "✅ $svc is available"
      curl -sSf "$url" > "specs/${svc}.json"
      break
    fi
    echo "⏳ Waiting $svc ($i/10)..."
    sleep 3
  done || echo "❌ $svc unavailable after 30 s"
done

# Generate swagger-config.json
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