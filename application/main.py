from pathlib import Path

from audio_merger import AudioMerger
from converter import Converter
from logger import logger, step
from normalizer import Normalizer
from page_spliter import PageSplitter
from text_chunker import TextChunker
from tts import TTS


def main():
    file_name="Truyen_ngan_Ngon_Den_Cuoi_Ben_OCR"
    pdf = Path(f"{file_name}.pdf")

    workspace = Path("workspace")

    audio_dir = workspace / "audio"
    audio_dir.mkdir(parents=True, exist_ok=True)

    splitter = PageSplitter()
    converter = Converter()
    chunker = TextChunker(max_chars=3000)
    normalizer = Normalizer()
    tts = TTS()
    merger = AudioMerger()

    logger.info("=" * 60)
    logger.info("Audiobook pipeline")
    logger.info("Input: %s", pdf.name)
    logger.info("=" * 60)

    with step("[1/5] Split PDF"):
        batches = splitter.split(
            pdf,
            pages_per_file=20,
        )

    audio_files = []

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
            print(batch.path)
            markdown = converter.pdf_to_md(str(batch.path))

        with step("Chunk"):
            chunks = chunker.split(markdown)

        for chunk_index, chunk in enumerate(
            chunks,
            start=1,
        ):

            logger.info(
                "Chunk %d/%d",
                chunk_index,
                len(chunks),
            )

            with step("Normalize"):
                normalized = normalizer.normalize(chunk)

            wav = (
                audio_dir
                / f"{batch_index:04}_{chunk_index:04}.wav"
            )

            with step("Generate Speech"):
                tts.generate(
                    text=normalized,
                    output_path=wav,
                    voice_name="Phạm Tuyên",
                )

            audio_files.append(wav)

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