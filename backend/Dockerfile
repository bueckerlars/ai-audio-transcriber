# --- Stage 1: Build Environment für Node.js und Python ---
    FROM node:18-bullseye AS builder 


    WORKDIR /app
    
    # Installiere systemabhängige Pakete (Python, ffmpeg, pip)
    RUN apt-get update && apt-get install -y python3 python3-pip python3-venv ffmpeg && rm -rf /var/lib/apt/lists/*

    
    # Kopiere und installiere die Node.js-Abhängigkeiten
    COPY package*.json ./
    RUN npm install --frozen-lockfile
    
    # Kopiere den restlichen Code ins Build-Image
    COPY . .
    
    # Erstelle eine virtuelle Python-Umgebung & installiere die Python-Abhängigkeiten
    RUN python3 -m venv /opt/venv
    ENV PATH="/opt/venv/bin:$PATH"
    RUN pip install --no-cache-dir torch transformers argparse accelerate coremltools
    
    # Lade das Hugging Face Modell vorab herunter
    RUN python -c "from transformers import pipeline; pipeline('automatic-speech-recognition', model='primeline/whisper-tiny-german-1224')"
    
    # --- Stage 2: Schlankes Laufzeit-Image ---
    FROM node:18-alpine AS runtime
    
    WORKDIR /app
    
    # Kopiere nur benötigte Dateien aus der Build-Stage
    COPY --from=builder /app /app
    COPY --from=builder /opt/venv /opt/venv
    
    # Setze die Python-Umgebung für die Laufzeit
    ENV PATH="/opt/venv/bin:$PATH"
    
    # Exponiere Port für das Backend
    EXPOSE 5066
    
    # Starte die Anwendung
    CMD ["npm", "start"]
    