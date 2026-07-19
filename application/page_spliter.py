from dataclasses import dataclass
from pathlib import Path

import fitz


@dataclass(slots=True)
class PageBatch:
    start_page: int
    end_page: int
    path: Path

    @property
    def page_count(self) -> int:
        return self.end_page - self.start_page + 1


class PageSplitter:
    def __init__(self, output_dir: str | Path = "workspace/pages"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def split(
        self,
        pdf_path: str | Path,
        pages_per_file: int = 20,
    ) -> list[PageBatch]:
        if pages_per_file <= 0:
            raise ValueError("pages_per_file must be greater than 0.")

        pdf_path = Path(pdf_path)

        source = fitz.open(pdf_path)

        batches: list[PageBatch] = []

        try:
            total_pages = source.page_count

            for start in range(0, total_pages, pages_per_file):
                end = min(start + pages_per_file - 1, total_pages - 1)

                batch = fitz.open()

                batch.insert_pdf(
                    source,
                    from_page=start,
                    to_page=end,
                )

                output_path = (
                    self.output_dir
                    / f"{start + 1:05}-{end + 1:05}.pdf"
                )

                batch.save(
                    output_path,
                    garbage=4,
                    deflate=True,
                )
                batch.close()

                batches.append(
                    PageBatch(
                        start_page=start + 1,
                        end_page=end + 1,
                        path=output_path,
                    )
                )

        finally:
            source.close()

        return batches