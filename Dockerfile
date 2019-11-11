FROM nginx:stable-alpine
ADD ./fe/dist/ /tmp/ui
EXPOSE 80
RUN rm -rf /usr/share/nginx/html/
RUN mv  /tmp/ui  /usr/share/nginx/html/
CMD ["nginx", "-g", "daemon off;"]
