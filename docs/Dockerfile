FROM swaggerapi/swagger-ui:v5.9.0
ENV VALIDATOR_URL=""   
ENV URLS="[ \
  { \"url\": \"/api-docs/auth.json\",       \"name\": \"Auth Service\" }, \
  { \"url\": \"/api-docs/user.json\",       \"name\": \"User Service\" }, \
  { \"url\": \"/api-docs/catalog.json\",    \"name\": \"Catalog Service\" }, \
  { \"url\": \"/api-docs/orders.json\",     \"name\": \"Orders Service\" }, \
  { \"url\": \"/api-docs/admin-product.json\", \"name\": \"Admin Product Service\" } \
]"
COPY specs/ /usr/share/nginx/html/api-docs/