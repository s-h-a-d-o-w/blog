FROM yuzutech/kroki:latest

USER root
RUN apt-get update && apt-get install -y fontconfig wget

RUN mkdir -p /usr/share/fonts/truetype/merriweather
RUN cd /usr/share/fonts/truetype/merriweather && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-400-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-700-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-900-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-400-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-700-normal.ttf && \
    wget https://cdn.jsdelivr.net/fontsource/fonts/merriweather@latest/latin-ext-900-normal.ttf
RUN chmod 644 /usr/share/fonts/truetype/merriweather/*.ttf && \
    fc-cache -f && \
    rm -rf /var/cache/*

USER kroki
EXPOSE 8000