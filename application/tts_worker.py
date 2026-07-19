from pathlib import Path
from queue import Queue
from threading import Thread

from logger import logger
from tts import TTS


class TTSWorker(Thread):

    def __init__(
        self,
        queue_in: Queue,
        tts: TTS,
        audio_dir: Path,
        stop_signal: object,
    ):
        super().__init__(daemon=True)

        self.queue_in = queue_in
        self.tts = tts
        self.audio_dir = audio_dir
        self.stop_signal = stop_signal

    def run(self):

        while True:

            item = self.queue_in.get()

            try:

                if item is self.stop_signal:
                    break

                batch_index, chunk_index, text = item

                wav = (
                    self.audio_dir
                    / f"{batch_index:04}_{chunk_index:04}.wav"
                )

                logger.info(
                    "[TTS] %04d-%04d",
                    batch_index,
                    chunk_index,
                )

                self.tts.generate(
                    text=text,
                    output_path=wav,
                    voice_name="Minh Triết",
                )

            finally:
                self.queue_in.task_done()