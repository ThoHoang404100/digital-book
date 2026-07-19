from pathlib import Path

from vieneu import Vieneu


class TTS:
    def __init__(
        self,
        emotion: str = "storytelling",
    ):
        self.tts = Vieneu(
            emotion=emotion,
        )

    def list_voices(self):
        return self.tts.list_preset_voices()

    def generate(
        self,
        text: str,
        output_path: str,
        voice_name: str | None = None,
    ):
        kwargs = {}

        if voice_name:
            kwargs["voice"] = self.tts.get_preset_voice(voice_name)

        audio = self.tts.infer(
            text=text,
            **kwargs,
        )

        self.tts.save(audio, output_path)

    def close(self):
        self.tts.close()

    def __enter__(self):
        return self

    def __exit__(self, *_):
        self.close() 