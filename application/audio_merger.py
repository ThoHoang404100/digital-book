from pathlib import Path
import subprocess
import tempfile


class AudioMerger:
    def merge(
        self,
        audio_files: list[str | Path],
        output_file: str | Path,
    ) -> None:
        if not audio_files:
            raise ValueError("audio_files is empty.")

        output_file = Path(output_file)
        output_file.parent.mkdir(parents=True, exist_ok=True)

        audio_paths = [Path(p).resolve() for p in audio_files]

        for path in audio_paths:
            if not path.exists():
                raise FileNotFoundError(path)

        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=".txt",
            delete=False,
            encoding="utf-8",
        ) as f:
            concat_file = Path(f.name)

            for audio in audio_paths:
                # escape single quote for ffmpeg
                escaped = str(audio).replace("'", r"'\''")
                f.write(f"file '{escaped}'\n")

        try:
            subprocess.run(
                [
                    "ffmpeg",
                    "-hide_banner",
                    "-loglevel",
                    "error",
                    "-y",
                    "-f",
                    "concat",
                    "-safe",
                    "0",
                    "-i",
                    str(concat_file),
                    "-c",
                    "copy",
                    str(output_file),
                ],
                check=True,
            )
        finally:
            concat_file.unlink(missing_ok=True)