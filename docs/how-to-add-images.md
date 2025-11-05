# 画像の追加方法

## 📂 フォルダ構成

```
note-auto-renai/
├── images/                          # 画像を配置するフォルダ
│   └── follower-growth/            # フォロワー増加用投稿の画像
│       ├── README.md               # 画像フォルダの説明
│       ├── anua-dokudami.png       # 例：Anuaドクダミの画像
│       ├── anua-retinol.png        # 例：Anuaレチノールの画像
│       └── ...                     # その他の画像
└── data/
    └── follower-growth-posts.js    # 投稿データ
```

**ポイント**: 投稿データファイル名（`follower-growth-posts.js`）に合わせて、画像も `images/follower-growth/` に配置します。

## 🎨 手順

### 1. 画像を準備

- **推奨サイズ**: 1200 x 675px (16:9) または 1200 x 1200px (1:1)
- **最大ファイルサイズ**: 5MB
- **対応形式**: PNG, JPG, GIF, WebP

### 2. 画像を `images/follower-growth/` フォルダに保存

```bash
# 画像をコピー
cp ~/Downloads/anua-dokudami.png /Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/
```

### 3. データファイルで画像パスを指定

`data/follower-growth-posts.js` を編集：

```javascript
{
  title: 'Anua｜ドクダミ80モイスチャースージングアンプル',
  text: `【先回り鎮静】🌿\n季節の変わり目や生理前に"まずこれ"。...`,
  
  // 画像パスを指定（相対パス・推奨）
  image: 'images/follower-growth/anua-dokudami.png'
}
```

**ポイント**: 
- ✅ **相対パス（推奨）**: `images/follower-growth/ファイル名.png`
- ✅ **絶対パス**: `/Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/ファイル名.png`

相対パスを使うと、環境が変わっても動作します。プロジェクトルート（`note-auto-renai/`）を基準に解決されます。

### 4. DRYRUNモードで確認

```bash
cd /Users/aa/projects/note-automation/note-auto-renai
node scripts/postFollowerGrowthTweet.js --dryrun
```

以下のように表示されればOK：

```
📷 画像（元）: images/follower-growth/anua-dokudami.png
📷 画像（解決後）: /Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/anua-dokudami.png
```

相対パスの場合、元のパスと解決後の絶対パスの両方が表示されます。

もし画像が見つからない場合：

```
⚠️ 警告: 画像ファイルが見つかりません: /path/to/image.png
テキストのみで投稿します
```

### 5. 実際に投稿

```bash
node scripts/postFollowerGrowthTweet.js
```

## 📸 画像の種類と例

### Before/After画像

```javascript
{
  title: 'Anua｜PDRN使用1ヶ月後のBefore/After',
  text: `【1ヶ月使用結果】\n肌のキメが整い、乾燥小ジワが目立たなく...`,
  image: 'images/follower-growth/pdrn-beforeafter.png'
}
```

### 製品写真

```javascript
{
  title: 'Anua｜レチノール0.3セラム',
  text: `【速攻で実感】⚡️\nレチ0.3×ナイアシン×セラミド...`,
  image: 'images/follower-growth/anua-retinol.png'
}
```

### 比較画像

```javascript
{
  title: 'デパコス vs プチプラ｜リップ比較',
  text: `【徹底比較】\nデパコス¥5,000 vs プチプラ¥1,200...`,
  image: 'images/follower-growth/comparison-lipstick.png'
}
```

### テクスチャー写真

```javascript
{
  title: 'Anua｜ドクダミのテクスチャー',
  text: `【テクスチャー解説】\nサラッと軽い、みずみずしい使用感...`,
  image: 'images/follower-growth/anua-dokudami-texture.png'
}
```

## 🔧 画像の最適化

### macOSでの画像リサイズ

```bash
cd /Users/aa/projects/note-automation/note-auto-renai/images/follower-growth

# 1200pxにリサイズ
sips -Z 1200 original.png --out resized.png

# 画質を指定して圧縮（JPEG）
sips -s format jpeg -s formatOptions 80 original.png --out compressed.jpg

# 複数画像を一括リサイズ
for f in *.png; do sips -Z 1200 "$f" --out "resized-$f"; done
```

### オンラインツールを使う

1. [TinyPNG](https://tinypng.com/) - PNG/JPG圧縮（ドラッグ&ドロップで簡単）
2. [Squoosh](https://squoosh.app/) - 高度な画像最適化
3. [Canva](https://www.canva.com/) - デザイン作成

## 💡 画像ファイル名の規則

### 推奨命名規則

```
ブランド-製品名-種類.png

例：
✅ anua-dokudami-product.png         # 製品写真
✅ anua-retinol-beforeafter.png      # Before/After
✅ comparison-lipstick-depa-vs-puchi.png  # 比較
✅ ingredient-vitaminc-info.png      # 成分解説
```

### NGな命名例

```
❌ IMG_1234.png              # 何の画像か分からない
❌ スクリーンショット.png      # 日本語ファイル名は避ける
❌ photo copy 2.png          # スペースは避ける
```

## ⚠️ 注意事項

### 著作権・肖像権

- ❌ **他人の写真を無断使用しない**
- ❌ **メーカーの公式画像を無断使用しない**
- ❌ **他のブロガー/インフルエンサーの画像を転載しない**
- ✅ **自分で撮影した写真を使用**
- ✅ **フリー素材を使用（ライセンス確認）**

### ファイルサイズ

Twitter の制限：
- **画像**: 最大 5MB
- **GIF**: 最大 15MB
- **動画**: 最大 512MB（今回は非対応）

5MBを超える場合は圧縮してください。

## 🔍 トラブルシューティング

### Q1: 画像が投稿されない

A: パスが正しいか確認してください。

```bash
# ファイルの存在確認
ls -lh /Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/anua-dokudami.png
```

### Q2: 「画像ファイルが見つかりません」エラー

A: パスの指定方法を確認してください。

```javascript
// ✅ 正しい（相対パス・推奨）
image: 'images/follower-growth/anua-dokudami.png'

// ✅ 正しい（絶対パス）
image: '/Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/anua-dokudami.png'

// ❌ 間違い（./ や ../ は不要）
image: './images/follower-growth/anua-dokudami.png'
image: '../images/follower-growth/anua-dokudami.png'

// ❌ 間違い（サブディレクトリ忘れ）
image: 'images/anua-dokudami.png'
```

相対パスはプロジェクトルート（`note-auto-renai/`）から始まります。`./` や `../` は不要です。

### Q3: 画像が大きすぎる

A: 画像を圧縮してください。

```bash
cd /Users/aa/projects/note-automation/note-auto-renai/images/follower-growth

# TinyPNGでオンライン圧縮
# または
sips -Z 1200 large.png --out compressed.png
```

## 📊 Git管理

### 画像をGitに含める場合

```bash
git add images/follower-growth/anua-dokudami.png
git commit -m "feat: Anuaドクダミの画像を追加"
git push
```

### 画像をGitから除外する場合

`.gitignore` に追加：

```
# 画像ファイルを除外
images/follower-growth/*.png
images/follower-growth/*.jpg
images/follower-growth/*.jpeg
!images/follower-growth/.gitkeep
```

大きい画像ファイルはGitに含めず、Google DriveやDropboxで管理することも検討してください。

## ✅ チェックリスト

投稿前に確認：

- [ ] 画像サイズは 5MB 以下
- [ ] 解像度は 1200px 程度
- [ ] ファイル名は分かりやすい英数字
- [ ] 相対パスまたは絶対パスで指定
- [ ] DRYRUNモードで動作確認
- [ ] 著作権・肖像権に問題なし

## 🚀 まとめ

1. 画像を `images/follower-growth/` フォルダに配置
2. `data/follower-growth-posts.js` でパスを指定
   - **相対パス（推奨）**: `images/follower-growth/ファイル名.png`
   - **絶対パス**: `/Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/ファイル名.png`
3. `--dryrun` で動作確認
4. 実際に投稿

### ディレクトリ構造の意義

```
images/
└── follower-growth/     # follower-growth-posts.js 用
    └── *.png
```

投稿データファイル名に合わせた構造にすることで：
- ✅ 他の投稿タイプを追加しやすい（例: `images/product-review/`）
- ✅ 画像の管理がしやすい
- ✅ 画像の用途が明確になる

画像付きツイートはエンゲージメントが**3倍**高くなるので、積極的に活用しましょう！

