ARG BASE_IMAGE
FROM ${BASE_IMAGE}

ARG EXPIRES_TIME
LABEL quay.expires-after=${EXPIRES_TIME}

# here is layer 2 "deploy"
# from nginx layer 1, use this image deploy POD

COPY dist/ /var/www/service/v3
COPY dist/index.html /var/www/service/index.html

RUN chown -R 900:900 /var/www/service
