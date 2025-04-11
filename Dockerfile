FROM docker-mirror.sh.synyi.com/node:16 AS build

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
COPY .npmrc .

RUN npm install --force

COPY . .

RUN npm run build --configuration=${CI_COMMIT_REF_SLUG}

FROM docker-mirror-old.sh.synyi.com/alpine:3.8 AS remove_exif

RUN mkdir -p /etc/apk && \
    echo "http://mirrors.ustc.edu.cn/alpine/v3.8/main/" > /etc/apk/repositories && \
    echo 'http://mirrors.ustc.edu.cn/alpine/v3.8/community' >>/etc/apk/repositories && \
    apk update && apk add -U bash exiftool
  
COPY --from=build /app/dist /app/dist

WORKDIR /app/dist

RUN find . -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -exec exiftool -all= {} \;


FROM docker.sh.synyi.com/nginx-with-featset:1.19.6.1 AS final

RUN echo "http://mirrors.ustc.edu.cn/alpine/v3.8/main/" > /etc/apk/repositories && \
    echo 'http://mirrors.ustc.edu.cn/alpine/v3.8/community' >>/etc/apk/repositories && \
    apk update && apk add -U gettext bash
RUN rm /etc/nginx/conf.d/*

WORKDIR /app

COPY --from=docker.sh.synyi.com/roquie/smalte:latest-alpine /app/smalte /usr/local/bin/smalte
COPY --from=remove_exif /app/dist/ai-platform/ /var/www/
COPY misc/nginx.conf /etc/nginx/nginx.conf
COPY misc/app.conf.template /etc/nginx/conf.d/app.conf.template

COPY misc/start.sh /start.sh
RUN chmod +x /start.sh

ENV WEBAPI__SERVER        backend-4403-org-datuan.sy
ENV SSO__Authority        http://172.16.50.191:37717
ENV TZ=Asia/Shanghai

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo '$TZ' > /etc/timezone

CMD ["/start.sh"]
