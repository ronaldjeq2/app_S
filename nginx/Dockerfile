FROM nginx:1.13.8

COPY conf/ssl-default.conf          /etc/nginx/conf.d/default.conf
COPY conf/nginx.conf                /etc/nginx/nginx.conf
COPY conf/.htpasswd                 /etc/nginx/.htpasswd
COPY private/app_senati_edu_pe.key  /opt/senati_edu_pe.key
COPY certs/senati_edu_pe.pem        /opt/senati_edu_pe.pem
COPY certs/DigiCertCA.crt           /opt/DigiCertCA.crt
COPY certs/dhparam.pem              /opt/dhparam.pem

COPY landing/src                    /usr/share/nginx/html
