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
  url="http://127.0.0.1:${port}/v3/api-docs"
  echo "🔗 Checking $svc on port $port..."

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