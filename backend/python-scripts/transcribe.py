import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
import argparse

def transcribe_audio(audio_file_path, output_file_path):
    # Prüfe, ob ein Apple Silicon Chip vorhanden ist
    if torch.backends.mps.is_available():
        device = "mps"  # Metal Performance Shaders für Mac
        print("✅ Nutze Apple Metal (GPU)")
    elif torch.cuda.is_available():
        device = "cuda:0"
        print("✅ Nutze CUDA (GPU)")
    else:
        device = "cpu"
        print("⚠️ Keine GPU gefunden, nutze CPU")

    torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32
    model_id = "primeline/whisper-tiny-german-1224"
    model = AutoModelForSpeechSeq2Seq.from_pretrained(
        model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
    )
    model.to(device)
    processor = AutoProcessor.from_pretrained(model_id)
    pipe = pipeline(
        "automatic-speech-recognition",
        model=model,
        tokenizer=processor.tokenizer,
        feature_extractor=processor.feature_extractor,
        max_new_tokens=128,
        chunk_length_s=30,
        batch_size=16,
        return_timestamps=True,
        torch_dtype=torch_dtype,
        device=device,
    )
    result = pipe(audio_file_path)
    with open(output_file_path, "w", encoding="utf-8") as f:
        f.write(result["text"])

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Transcribe audio file.")
    parser.add_argument("--audio", required=True, help="Path to the audio file.")
    parser.add_argument("--output", required=True, help="Path to the output text file.")
    args = parser.parse_args()
    transcribe_audio(args.audio, args.output)