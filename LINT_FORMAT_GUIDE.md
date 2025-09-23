# Git設定の説明

#

# このプロジェクトでは以下の設定が適用されています：

#

# 1. コミットメッセージテンプレート: .gitmessage

# - git commit でエディタが開いた時に日本語でメッセージを書くことができます

#

# 2. ESLint + Prettier + Husky + lint-staged

# - コミット前に自動でコードのlint・formatが実行されます

#

# 3. 利用可能なコマンド:

# - npm run lint: ESLintでコードの問題をチェック

# - npm run lint:fix: ESLintで自動修正

# - npm run format: Prettierでコードをフォーマット

# - npm run format:check: フォーマットのチェック

#

# 4. コミット時の自動実行:

# - pre-commitフックでlint-stagedが実行され、ステージされたファイルのみがlint・formatされます
