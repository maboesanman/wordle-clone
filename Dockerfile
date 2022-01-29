FROM node:latest AS builder
# common packages
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
    ca-certificates curl file \
    build-essential \
    autoconf automake autotools-dev libtool xutils-dev && \
    rm -rf /var/lib/apt/lists/*

ENV SSL_VERSION=1.0.2u

RUN curl https://www.openssl.org/source/openssl-$SSL_VERSION.tar.gz -O && \
    tar -xzf openssl-$SSL_VERSION.tar.gz && \
    cd openssl-$SSL_VERSION && ./config && make depend && make install && \
    cd .. && rm -rf openssl-$SSL_VERSION*

ENV OPENSSL_LIB_DIR=/usr/local/ssl/lib \
    OPENSSL_INCLUDE_DIR=/usr/local/ssl/include \
    OPENSSL_STATIC=1

# install all 3 toolchains
RUN curl https://sh.rustup.rs -sSf | \
    sh -s -- --default-toolchain stable -y

ENV PATH=/root/.cargo/bin:$PATH

RUN curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh

WORKDIR /app
COPY package-lock.json package.json ./
COPY core core
RUN npm ci

COPY . .

RUN npm run build

FROM alpine as compresser
RUN apk add brotli
COPY --from=builder /app/dist /app/dist
RUN find /app/dist -type f -regex ".*\.\(js\|html\|wasm\)" -exec gzip -k -9 {} \; -exec brotli -k -Z {} \;

FROM macbre/nginx-brotli:latest as final
COPY nginx_config/nginx.conf /etc/nginx/nginx.conf
COPY --from=compresser /app/dist /usr/share/nginx/html
