 
import re


class TextChunker:
    def __init__(
        self,
        max_chars: int = 3000,
        overlap: int = 200,
    ):
        self.max_chars = max_chars
        self.overlap = overlap

    def split(self, text: str) -> list[str]:
        paragraphs = [
            p.strip()
            for p in text.split("\n\n")
            if p.strip()
        ]

        chunks: list[str] = []
        current = ""

        for paragraph in paragraphs:
            # Paragraph vẫn còn nhỏ
            if len(paragraph) <= self.max_chars:
                candidate = (
                    paragraph
                    if not current
                    else current + "\n\n" + paragraph
                )

                if len(candidate) <= self.max_chars:
                    current = candidate
                    continue

                chunks.append(current)
                current = paragraph
                continue

            # Paragraph quá lớn
            if current:
                chunks.append(current)
                current = ""

            chunks.extend(
                self._split_long_paragraph(paragraph)
            )

        if current:
            chunks.append(current)

        return chunks

    def _split_long_paragraph(
        self,
        paragraph: str,
    ) -> list[str]:
        sentences = re.split(
            r"(?<=[.!?…])\s+",
            paragraph,
        )

        chunks: list[str] = []
        current = ""

        for sentence in sentences:
            candidate = (
                sentence
                if not current
                else current + " " + sentence
            )

            if len(candidate) <= self.max_chars:
                current = candidate
                continue

            if current:
                chunks.append(current)

            # Một câu còn dài hơn max_chars
            if len(sentence) > self.max_chars:
                chunks.extend(
                    self._split_by_length(sentence)
                )
                current = ""
            else:
                current = sentence

        if current:
            chunks.append(current)

        return chunks

    def _split_by_length(
        self,
        text: str,
    ) -> list[str]:
        chunks = []

        start = 0

        while start < len(text):
            end = start + self.max_chars

            chunks.append(text[start:end])

            start = end - self.overlap

        return chunks