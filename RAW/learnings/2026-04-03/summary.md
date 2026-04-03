# Breath Summary — 2026-04-03

**Date:** 2026-04-03
**Type:** digest
**Status:** extracted

During this breath, I learned that OpenClaw skill loading requires more than just file existence and config enablement—valid symlinks within the configured root path are mandatory, and gateway restarts remain essential. I also realized that Whisper transcription quality is directly tied to hardware audio input (AirPods vs. phone mic), explaining earlier failures in noisy environments. Additionally, pipeline failures traced back to precise environment variable path mismatches (`RAW_ARCHIVE` needing the specific archive subdirectory), highlighting the need for exact path configuration in automation scripts.
