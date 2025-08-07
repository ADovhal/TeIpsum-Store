FROM swaggerapi/swagger-ui:v5.9.0

ENV VALIDATOR_URL=""
ENV URLS="[ \
  { \"url\": \"./auth.json\",       \"name\": \"Auth Service\" }, \
  { \"url\": \"./user.json\",       \"name\": \"User Service\" }, \
  { \"url\": \"./catalog.json\",    \"name\": \"Catalog Service\" }, \
  { \"url\": \"./order.json\",     \"name\": \"Orders Service\" }, \
  { \"url\": \"./admin-product.json\", \"name\": \"Admin Product Service\" } \
]"

COPY specs/ /usr/share/nginx/html/