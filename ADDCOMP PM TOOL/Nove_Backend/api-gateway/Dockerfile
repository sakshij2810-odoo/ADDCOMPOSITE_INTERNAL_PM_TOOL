# Kong API Gateway Dockerfile
FROM kong:3.4-alpine

# Copy Kong configuration
COPY kong.yml /usr/local/kong/declarative/kong.yml

# Set environment variables
ENV KONG_DATABASE=off
ENV KONG_DECLARATIVE_CONFIG=/usr/local/kong/declarative/kong.yml
ENV KONG_PROXY_ACCESS_LOG=/dev/stdout
ENV KONG_ADMIN_ACCESS_LOG=/dev/stdout
ENV KONG_PROXY_ERROR_LOG=/dev/stderr
ENV KONG_ADMIN_ERROR_LOG=/dev/stderr
ENV KONG_ADMIN_LISTEN=0.0.0.0:8001
ENV KONG_PROXY_LISTEN=0.0.0.0:8000

# Expose ports
EXPOSE 8000 8001 8443 8444

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD kong health || exit 1

# Start Kong
CMD ["kong", "docker-start"]
