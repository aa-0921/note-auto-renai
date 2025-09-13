#!/bin/bash

echo "=== フォロー処理開始 ==="
node follow/followFromArticles.js --bg
echo "=== フォロー処理完了 ==="

echo "=== いいね処理開始 ==="
echo "1. counselor_risa のいいね処理"
node likeNotesByUrl.js --bg https://note.com/counselor_risa

echo "2. investment_happy のいいね処理"
node likeNotesByUrl.js --bg https://note.com/investment_happy

echo "3. enginner_skill のいいね処理"
node likeNotesByUrl.js --bg https://note.com/enginner_skill

echo "=== 全処理完了 ==="
