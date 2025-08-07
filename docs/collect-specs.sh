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

for name in "${!ports[@]}"; do
  port=${ports[$name]}
  url="http://127.0.0.1:${port}/v3/api-docs"
  echo "🔗 Checking $name on port $port..."
  if curl -sSf "$url" >/dev/null; then
    echo "✅ $name is available"
    curl -sSf "$url" > "specs/${name}.json"
  else
    echo "❌ $name is not available, skipping..."
  fi
done