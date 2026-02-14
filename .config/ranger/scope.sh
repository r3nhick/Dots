#!/usr/bin/env bash
# scope.sh для ranger + Ghostty (ASCII/text preview)

# ==== TEXT FILES ====
if [[ "$FILE_MIME" =~ text/* ]]; then
    bat --style=numbers --color=always --paging=never "$FILE_PATH"
    exit 0
fi

