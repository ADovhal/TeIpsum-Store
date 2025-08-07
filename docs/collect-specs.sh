#!/bin/bash
set -e
mkdir -p specs

curl -sSf http://prod-auth-service:9090/v3/api-docs       > specs/auth.json
curl -sSf http://prod-user-service:9093/v3/api-docs       > specs/user.json
curl -sSf http://prod-catalog-service:9098/v3/api-docs    > specs/catalog.json
curl -sSf http://prod-order-service:8100/v3/api-docs      > specs/orders.json
curl -sSf http://prod-admin-product-service:9096/v3/api-docs > specs/admin-product.json