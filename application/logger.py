import logging
from contextlib import contextmanager
from time import perf_counter


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(message)s",
)


logger = logging.getLogger("audiobook")


@contextmanager
def step(title: str):
    logger.info("=" * 60)
    logger.info(title)

    start = perf_counter()

    try:
        yield
    finally:
        logger.info(
            "%s completed in %.2fs",
            title,
            perf_counter() - start,
        )