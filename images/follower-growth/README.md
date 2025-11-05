# フォロワー増加用投稿の画像フォルダ

このフォルダに `follower-growth-posts.js` で使用する画像を配置します。

## 📂 ディレクトリ構成

```
images/
└── follower-growth/          # フォロワー増加用投稿の画像
    ├── README.md            # このファイル
    ├── anua-dokudami.png    # 例：Anuaドクダミの製品画像
    ├── anua-retinol.png     # 例：Anuaレチノールの製品画像
    ├── beforeafter-01.png   # Before/After画像
    └── ...
```

## 🎨 画像の配置方法

### 1. このフォルダに画像を保存

```bash
# 画像をコピー
cp ~/Downloads/anua-dokudami.png /Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/
```

### 2. データファイルで画像パスを指定

`data/follower-growth-posts.js` でパスを指定：

```javascript
{
  title: 'Anua｜ドクダミ80モイスチャースージングアンプル',
  text: `【先回り鎮静】🌿\n...`,
  
  // 相対パス（推奨）
  image: 'images/follower-growth/anua-dokudami.png'
  
  // または絶対パス
  // image: '/Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/anua-dokudami.png'
}
```

**ポイント**: 相対パスを使うと、環境が変わっても動作します。プロジェクトルート（`note-auto-renai/`）を基準に解決されます。

## 📸 推奨画像仕様

- **最大ファイルサイズ**: 5MB
- **推奨アスペクト比**: 16:9 (1200 x 675px) または 1:1 (1200 x 1200px)
- **対応形式**: PNG, JPG, GIF, WebP

## 📝 ファイル名の規則

### 製品別

```
ブランド-製品名.png

例：
anua-dokudami.png
anua-retinol.png
anua-azelaic.png
dior-lipstick.png
```

### Before/After

```
beforeafter-製品名.png
beforeafter-番号.png

例：
beforeafter-anua-pdrn.png
beforeafter-01.png
beforeafter-02.png
```

### 比較画像

```
comparison-種類-番号.png

例：
comparison-lipstick-01.png
comparison-foundation-depa-vs-puchi.png
comparison-serum-price.png
```

### テクスチャー・詳細

```
製品名-texture.png
製品名-ingredient.png
製品名-detail.png

例：
anua-dokudami-texture.png
vitaminc-ingredient.png
retinol-detail.png
```

## 🔧 画像の最適化

### macOSでリサイズ

```bash
cd /Users/aa/projects/note-automation/note-auto-renai/images/follower-growth

# 1200pxにリサイズ
sips -Z 1200 original.png --out resized.png

# 複数画像を一括リサイズ
for f in *.png; do sips -Z 1200 "$f" --out "resized-$f"; done
```

### オンラインツール

- [TinyPNG](https://tinypng.com/) - 簡単にPNG/JPG圧縮
- [Squoosh](https://squoosh.app/) - 高度な画像最適化
- [Canva](https://www.canva.com/) - デザイン作成

## ⚠️ 注意事項

### 著作権
- ✅ 自分で撮影した写真
- ✅ フリー素材（ライセンス確認）
- ❌ 他人の写真の無断使用
- ❌ メーカー公式画像の無断使用

### ファイルサイズ
- Twitter制限: 画像 5MB まで
- 5MB超える場合は TinyPNG で圧縮

## 💡 まとめ

1. このフォルダに画像を配置
2. `data/follower-growth-posts.js` で相対パス（`images/follower-growth/ファイル名.png`）または絶対パスを指定
3. ファイル名は英数字で分かりやすく
4. 5MB以下、1200px推奨

**相対パス推奨**: 環境が変わっても動作し、管理しやすい！

画像付きツイートはエンゲージメントが3倍高い！

