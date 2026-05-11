#!/usr/bin/env bash
set -euo pipefail

: "${BEGET_HOST:?Set BEGET_HOST, for example: ssh.beget.com}"
: "${BEGET_USER:?Set BEGET_USER, for example: login}"
: "${BEGET_PATH:?Set BEGET_PATH, for example: /home/login/neon-dev.ru/public_html}"

npm run check

rsync -az --delete \
  --exclude='.DS_Store' \
  dist/ "${BEGET_USER}@${BEGET_HOST}:${BEGET_PATH}/"

echo "Deploy complete: ${BEGET_USER}@${BEGET_HOST}:${BEGET_PATH}"
