from threading import Thread
from queue import Queue
from normalizer import Normalizer
from logger import logger



class NormalizeWorker(Thread):
    def __init__(
        self,
        queue_in: Queue,
        queue_out: Queue,
        normalizer: Normalizer,
        stop_signal: object,
    ):
        super().__init__(daemon=True)

        self.queue_in = queue_in
        self.queue_out = queue_out
        self.normalizer = normalizer
        self.stop_signal = stop_signal

    def run(self):
        while True:

            item = self.queue_in.get()

            if item is self.stop_signal:
                self.queue_out.put(self.stop_signal)
                self.queue_in.task_done()
                break

            batch_index, chunk_index, chunk = item

            logger.info(
                "[Normalize] %04d-%04d",
                batch_index,
                chunk_index,
            )

            normalized = self.normalizer.normalize(chunk)

            self.queue_out.put(
                (
                    batch_index,
                    chunk_index,
                    normalized,
                )
            )

            self.queue_in.task_done()