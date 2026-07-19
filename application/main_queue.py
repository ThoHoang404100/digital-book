from pathlib import Path
from queue import Queue

from audio_merger import AudioMerger
from converter import Converter
from logger import logger, step
from normalizer import Normalizer
from normalize_worker import NormalizeWorker
from page_spliter import PageSplitter
from text_chunker import TextChunker
from tts import TTS
from tts_worker import TTSWorker


def main():
    file_name = "triethocmaclenin"

    pdf = Path(f"{file_name}.pdf")

    workspace = Path("workspace")

    audio_dir = workspace / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)

    splitter = PageSplitter()
    converter = Converter()
    chunker = TextChunker(max_chars=500)
    normalizer = Normalizer()
    tts = TTS()
    merger = AudioMerger()

    normalize_queue = Queue()
    tts_queue = Queue()

    STOP = object()

    normalize_worker = NormalizeWorker(
        queue_in=normalize_queue,
        queue_out=tts_queue,
        normalizer=normalizer,
        stop_signal=STOP,
    )

    tts_worker = TTSWorker(
        queue_in=tts_queue,
        tts=tts,
        audio_dir=audio_dir,
        stop_signal=STOP,
    )

    normalize_worker.start()
    tts_worker.start()

    logger.info("=" * 60)
    logger.info("Audiobook pipeline")
    logger.info("Input: %s", pdf.name)
    logger.info("=" * 60)

    with step("[1/5] Split PDF"):
        batches = splitter.split(
            pdf,
            pages_per_file=1,
        )

    total_batches = len(batches)

    for batch_index, batch in enumerate(
        batches,
        start=1,
    ):
        logger.info(
            "[Batch %d/%d] Pages %d-%d",
            batch_index,
            total_batches,
            batch.start_page,
            batch.end_page,
        )

        with step("Convert PDF -> Markdown"):
            markdown = converter.pdf_to_md(str(batch.path))

        with step("Chunk"):
            chunks = chunker.split(markdown)

        for chunk_index, chunk in enumerate(chunks, start=1):

            normalize_queue.put(
                (
                    batch_index,
                    chunk_index,
                    chunk,
                )
            )

    normalize_queue.put(STOP)

    normalize_queue.join()
    tts_queue.join()

    normalize_worker.join()
    tts_worker.join()

    audio_files = sorted(audio_dir.glob("*.wav"))

    with step("[5/5] Merge Audio"):
        merger.merge(
            audio_files,
            workspace / f"{file_name}.wav",
        )

    logger.info("=" * 60)
    logger.info("Done!")
    logger.info("=" * 60)


if __name__ == "__main__":
    main()