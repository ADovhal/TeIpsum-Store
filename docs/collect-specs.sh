#!/bin/bash
set -e
mkdir -p specs

declare -A urls=(
  [auth]="http://prod-auth-service:9090/v3/api-docs"
  [user]="http://prod-user-service:9093/v3/api-docs"
  [catalog]="http://prod-catalog-service:9098/v3/api-docs"
  [order]="http://prod-order-service:8100/v3/api-docs"
  [admin-product]="http://prod-admin-product-service:9096/v3/api-docs"
)

for svc in "${!urls[@]}"; do
  url=${urls[$svc]}
  echo "🔗 Fetching $svc spec from $url..."

  for i in {1..10}; do
    if curl -sSf "$url" >/dev/null; then
      echo "✅ $svc is available"
      curl -sSf "$url" | jq '.servers = [{"url": "/", "description": "Production server"}]' > "specs/${svc}.json"
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