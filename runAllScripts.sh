#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== 全自動処理開始 ==="

run_step() {
  local title="$1"
  shift
  echo
  echo "---- ${title} 開始 ----"
  echo "コマンド: $*"
  "$@"
  echo "---- ${title} 完了 ----"
}

# scripts/ 配下の代表的な処理をすべて順次実行
run_step "下書きノート作成 (autoCreateAndDraftNote)" node scripts/autoCreateAndDraftNote.js
run_step "ノート自動公開 (autoPublishNotes)" node scripts/autoPublishNotes.js
run_step "ゲストいいね (likeAsGuestByAccounts)" node scripts/likeAsGuestByAccounts.js
run_step "記事からフォロー (followFromArticles)" node scripts/followFromArticles.js


echo
echo "=== 全処理完了 ==="
