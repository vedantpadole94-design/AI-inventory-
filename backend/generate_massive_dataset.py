"""Compatibility entry point for the production-scale dataset generator.

The implementation lives in ``generate_datasets.py`` so existing local
commands continue to work. This named entry point matches the project data
specification and exposes the same generator functions.
"""

from generate_datasets import *
from generate_datasets import main


if __name__ == "__main__":
    main()
