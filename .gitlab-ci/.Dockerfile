FROM asia-east1-docker.pkg.dev/gcp-20210526-001/platform/base-nginx:latest

RUN mkdir -p /var/www/service
RUN mkdir -p /var/log/base/ && \
    touch /var/log/base/error.log

COPY dist/ /var/www/service/v3
COPY dist/index.html /var/www/service/index.html

RUN chown -R 900:900 /var/www/service