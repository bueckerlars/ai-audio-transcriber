# Basis-Image mit Node.js 18 & Python 3
FROM node:18

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die Package-Dateien und installiere die Node-Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere den restlichen Code ins Image
COPY . .

# Installiere Python und benötigte Systemabhängigkeiten
RUN apt-get update && apt-get install -y python3 python3-pip python3-venv ffmpeg

# Erstelle eine virtuelle Python-Umgebung & installiere Abhängigkeiten
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --no-cache-dir torch transformers argparse accelerate coremltools

# Lade das Hugging Face Modell vorab herunter, um Verzögerungen zu vermeiden
RUN python -c "from transformers import pipeline; pipeline('automatic-speech-recognition', model='primeline/whisper-tiny-german-1224')"

# Exponiere Port 5000 für das Backend
EXPOSE 5000

# Starte die Node.js Anwendung
CMD ["npm", "start"]
