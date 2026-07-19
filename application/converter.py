import re

from marker.converters.pdf import PdfConverter
from marker.models import create_model_dict
from marker.output import text_from_rendered

class Converter:
    def __init__(self):
        self.converter = PdfConverter(
            artifact_dict=create_model_dict(),
        )

    def pdf_to_md(self, file_path: str) -> str:
        rendered = self.converter(file_path)
        markdown, _, _ = text_from_rendered(rendered)

        return self._remove_images(markdown)

    @staticmethod
    def _remove_images(markdown: str) -> str:
        """
        Remove every image from markdown.

        Remove:
        - ![](image.png)
        - ![alt](...)
        - <img ...>
        """

        # Markdown image syntax
        markdown = re.sub(
            r"!\[[^\]]*]\([^)]*\)",
            "",
            markdown,
        )

        # HTML img tag
        markdown = re.sub(
            r"<img\b[^>]*>",
            "",
            markdown,
            flags=re.IGNORECASE,
        )

        # Remove excessive blank lines
        markdown = re.sub(r"\n{3,}", "\n\n", markdown)

        return markdown.strip()