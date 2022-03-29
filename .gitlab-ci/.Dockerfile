FROM gcr.io/rd6-project/images-build-nginx:latest

RUN mkdir -p /var/www/service
RUN mkdir -p /var/log/base/ && \
    touch /var/log/base/error.log

COPY dist/ /var/www/service

RUN chown -R 900:900 /var/www/service
