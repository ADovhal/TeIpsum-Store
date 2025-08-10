#!/bin/bash
set -e
mkdir -p specs

declare -A host_urls=(
  [auth]="https://www.teipsum.store/api/auth/v3/api-docs"
  [user]="https://www.teipsum.store/api/users/v3/api-docs"
  [catalog]="https://www.teipsum.store/api/products/v3/api-docs"
  [order]="https://www.teipsum.store/api/orders/v3/api-docs"
  [admin-product]="https://www.teipsum.store/api/admin/products/v3/api-docs"
)

for svc in "${!host_urls[@]}"; do
  url="${host_urls[$svc]}"
  echo "🔗 Downloading $svc spec..."
  curl -sSf "$url" > "specs/${svc}.json"

  for i in {1..10}; do
    if curl -sSf "$url" >/dev/null; then
      echo "✅ $svc is available"
      curl -sSf "$url" \
        | jq --arg url "./${svc}.json" '.servers[0].url = $url' \
        > "specs/${svc}.json"
      break
    fi
    echo "⏳ Waiting $svc ($i/10)..."
    sleep 3
  done || echo "❌ $svc unavailable after 30 s"
done