# Basis-Image mit Node.js 18 & Python 3 für das KI-Skript
FROM node:18

# Setze das Arbeitsverzeichnis im Container
WORKDIR /app

# Kopiere die Package-Dateien und installiere die Abhängigkeiten
COPY package*.json ./
RUN npm install

# Kopiere den restlichen Code ins Image
COPY . .

# Installiere Python & Pip-Abhängigkeiten für Whisper
RUN apt-get update && apt-get install -y python3 python3-pip

# Installiere die benötigten Python-Module für das Transkriptions-Skript
RUN pip install --no-cache-dir torch transformers

# Lade das Hugging Face Modell vorab herunter, damit es im Container bleibt
RUN python3 -c "from transformers import pipeline; pipeline('automatic-speech-recognition', model='primeline/whisper-large-v3-turbo-german')"

# Exponiere Port 5000 für das Backend
EXPOSE 5066

# Starte die Node.js Anwendung
CMD ["npm", "start"]
