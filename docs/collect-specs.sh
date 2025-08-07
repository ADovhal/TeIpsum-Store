#!/bin/bash
set -e
mkdir -p specs

services=(
  "auth:9090"
  "user:9093"
  "catalog:9098"
  "order:8100"
  "admin-product:9096"
)

for svc in "${services[@]}"; do
  IFS=':' read -r name port <<< "$svc"
  echo "🔗 Checking $name on port $port..."
  if curl -sSf http://prod-$name:$port/v3/api-docs -o /dev/null; then
    echo "✅ $name is available"
    curl -sSf http://prod-$name:$port/v3/api-docs > specs/${name}.json
  else
    echo "❌ $name is not available, skipping..."
  fi
done