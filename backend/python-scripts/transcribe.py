import sys
import torch
from transformers import pipeline

def transcribe(audio_path, output_path):
    print(f"Transkribiere {audio_path}...")
    
    pipe = pipeline("automatic-speech-recognition", model="primeline/whisper-large-v3-turbo-german")
    result = pipe(audio_path)

    with open(output_path, "w") as f:
        f.write(result["text"])

    print(f"Transkription gespeichert: {output_path}")

if __name__ == "__main__":
    audio_file = sys.argv[1]
    output_file = sys.argv[2]
    transcribe(audio_file, output_file)
