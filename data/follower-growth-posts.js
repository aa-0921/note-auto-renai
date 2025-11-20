/**
 * Twitter投稿データ（フォロワー増加用）
 * 
 * 配列内の各オブジェクトがランダムに選ばれて投稿されます
 * 
 * 画像を追加する場合：
 * - 相対パス（推奨）: image: 'images/follower-growth/ファイル名.png'
 * - 絶対パス: image: '/Users/aa/projects/note-automation/note-auto-renai/images/follower-growth/ファイル名.png'
 * 
 * 相対パスはプロジェクトルート（note-auto-renai/）を基準に解決されます
 * 
 * 例：
 * image: 'images/follower-growth/anua-dokudami.png'
 * image: 'images/follower-growth/vt-pdrn-capsule-cream.jpg'
 */

// - title/textを合わせて 全角140文字（半角280文字）に収まるように
// - 適度に改行を入れて読みやすく

/**
 * 表現スタイルの変更
 * 
 * 1. 括弧の削除：【】などの括弧を削除し、より自然な表現に
 * 
 * 2. 口語的表現：「〜になった」「〜してる」「〜だよ」「〜できた」など
 *    感嘆符の使用：重要なポイントに「！」を適度に配置
 *    接続詞の活用：「〜し、」で複数の効果を自然につなぐ
 * 
 * 3. ハッシュタグ・絵文字の統一
 *    ハッシュタグをすべて削除
 *    絵文字を3種類に統一：🎀 ‼️ 🥺 のみ使用
 *    投稿の冒頭や最後に🎀を配置して統一感を出している
 * 
 * 4. 文体の特徴
 *    硬い表現（「総評：」「結論：」など）を削除
 *    「〜になったよ」「〜してる」「〜できた」など、より親しみやすい表現
 *    実体験ベースの口語的なレビュー調
 *    「されており」のような堅い表現は使わない
 * 
 * 5. 構造の特徴
 *    改行を適度に入れて読みやすく
 *    文字数制限：重要：タイトル、テキスト含め、全角140文字（半角280文字）に収まるよう調整
 */

export const posts = [
  {
    title: 'Anua全シリーズ本音レビュー',
    text: `🎀使い切って分かった指名買いリスト！

乾燥ならPDRN、跡や毛穴やハリならレチ0.3、皮脂や赤みならアゼ15、速攻トーンUPや毛穴ならビタミン10、色素沈着ならダークスポット、透明感やツヤなら桃70、揺らぎならドクダミ80。

肌悩み別に選べばハズさないよ🎀`,
    image: 'images/follower-growth/anua-serum.jpg'
  }
  ,
  {
    title: 'Anua｜PDRNヒアルロン酸カプセル100セラム本音レビュー',
    text: `🎀内側しっとり、外側さらり。PDRN×ヒアルロン酸で一日中つっぱらないよ。

3本使い切りで生理前も荒れにくくなって、乾燥小ジワもふっくらしてきた。

安定感が正義🎀　https://amzn.to/3X00gCd`,
    // image: 'images/follower-growth/anua-pdrn-hyaluron-serum.jpg'
    image: ''
  },
  {
    title: 'Anua｜レチノール0.3ナイアシンリニューイングセラム',
    text: `🎀レチ0.3×ナイアシン×セラミドで多角アプローチ。

跡や毛穴やハリ不足をケアして、ざらつき消えてキメが詰まって輪郭がシャープに。

夜は少量で保湿重ねて刺激最小。攻めたい夜に使ってる🎀　https://amzn.to/4oOI2jm`,
    // image: 'images/follower-growth/ANUA-reti.jpg'
    image: ''
  },
  {
    title: 'Anua｜アゼライン酸15インテンスカーミングセラム',
    text: `🎀皮脂の切り札

アゼライン酸15%で朝のテカりや夕方のベタつきが激減。

赤みやニキビや跡にもマルチに効いて、Tゾーンの崩れが減って触り心地つるん。

脂性や混合の味方だよ🎀　https://amzn.to/4oHjbOc`,
    // image: 'images/follower-growth/anua-azelaic-serum.jpg'
    image: ''
  },
  {
    title: 'Anua｜ビタミン10 PORESTRIXセラム',
    text: `🎀毛穴キュッ、トーンUPを実感！

キメが締まって黒ずみが目立ちにくくなった。ピリつきにくくて毎日ケアに使える

使ってすぐ明るさが一段上がる速攻型。

写真映え狙える🎀 https://amzn.to/4r5TkRx`,
    image: 'images/follower-growth/anua-vitamin-serum.jpg'
  },
  {
    title: 'Anua｜ダークスポットセラム',
    text: `🎀色素沈着に狙い撃ちできた！

ナイアシン×トラネキサムで、シミやそばかすに効いた🎀

停滞してた色ムラに手応えがあったよ🎀 https://amzn.to/4ibeNog`,
    // image: 'images/follower-growth/anua-niacinamide-txa-serum.jpg'
    image: ''
  },
  {
    title: 'Anua｜桃70ナイアシンセラム',
    text: `🎀ぷるツヤ透明感！

とろける質感で内側から効いてる感じ🎀

継続でワントーン明るくなって、メイク密着もUP

保湿×ブライトニングのバランス良し。脂性肌は量控えめにしてる。

可愛い質感が続く。香りも心地よい🎀 https://amzn.to/4nZ3yAx`,
    // image: 'images/follower-growth/anua-peach-niacin-serum.jpg'
    image: ''
  },
  {
    title: 'Anua｜ドクダミ80モイスチャースージングアンプル',
    text: `🎀先回り鎮静が助かる！

季節の変わり目や生理前にはまずこれを使ってる🎀

赤みやヒリつきを落ち着かせて、保水力も底上げ

肌が荒れそうな時に即投入してる🎀　https://amzn.to/49nqExa`,
    // image: 'images/follower-growth/anua-dokudami-heartleaf-serum.jpg'
    image: ''
  },
  {
    title: '組み合わせ｜レチノール × アゼライン酸（ニキビ特化）',
    text: `🎀増やさないし消せるようになった！

皮脂過多で詰まりやすい人に。

朝や夜はアゼ、夜にレチで回転UP。テカり減ってつるん肌になったよ。

保湿＋UVで刺激ケアも万全。使い分けが勝ち筋だよ🎀`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: '組み合わせ｜ドクダミ × アゼライン酸（荒れ/赤み）',
    text: `🎀鎮静しつつ皮脂抑制できた！

赤みが出やすい、思春期ニキビに。

ドクダミで土台を落ち着かせて、アゼで皮脂と菌バランスを整えてる。

敏感時はドクダミ多めで、慣れたらアゼ増量。荒れ癖リセットできたよ🎀`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: '組み合わせ｜ダークスポット × レチノール（跡/シミ）',
    text: `🎀点に効かせて面で晴らせた！

ダークスポットで生成抑制、レチで回転UP。

跡の残る影が均一に薄くなったよ。夜は交互か重ね、日中はUV徹底してる。

美白と跡ケアを同時にできてる。効かせ方が肝だよ🎀`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: '組み合わせ｜PDRN × レチノール（ハリ/弾力）',
    text: `🎀ふわもち弾力になった！

PDRNで水分土台を作って、レチで回転UP。

ふっくら感とリフト感を両取りできた。乾燥小ジワも浅くなったよ。

やわらかいのにシャープ。触れたくなる質感になった🎀`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: 'VT PDRN+カプセルクリーム100',
    text: `🎀ほんとに潤う！

多め連用でニキビ出たから少量推奨。潤い・メイクノリは◎。

PDRNが肌の角層まで深く浸透🎀　https://amzn.to/3M8lewg`,
    // image: 'images/follower-growth/vt-pdrm-capsule-cream.jpg'
    image: ''
  },
  {
    title: 'numbuzin No.5（ナンバーズイン5番）セラム 本音レビュー',
    text: `🎀こっくり質感。翌朝ふっくら肌

高濃縮グルタチオンとナイアシンアミドで、透明感のあるツヤ白玉肌🎀

使ってみて分かったよ🎀 https://amzn.to/3XCczEU`,
    // image: 'images/follower-growth/numbuzin-5.jpg'
    image: ''
  },
  {
    title: 'クオリティファースト ウルセラC 本音レビュー',
    text: `🎀毛穴がほんとに目立たなくなった

肌なじみも良かった！毛穴に最強かも🎀

使ってみて分かった🎀 https://amzn.to/44baovH`,
    // image: 'images/follower-growth/Quality-1st.jpg'
    image: ''
  },
  {
    title: 'メラノCC プレミアム美容液 本音レビュー',
    text: `🎀シミが薄くなってきたよ

ニキビ跡が薄くなって部分使いで効果実感🎀

https://amzn.to/4iaVcET`,
    // image: 'images/follower-growth/merano-cc.jpg'
    image: ''
  },
  {
    title: 'Anua レチノール0.3% ナイアシンセラム 本音レビュー',
    text: `🎀レチ0.3%×ナイアシンで毛穴やシワやトーンUPできた。

初期はピリつきや乾燥したから隔日で少量で保湿厚め。

慣れるとハリ実感できたよ🎀 https://amzn.to/4pm9kNV`,
    // image: 'images/follower-growth/ANUA-reti.jpg'
    image: ''
  },
  {
    title: 'Innisfree レチノールシカ 本音レビュー',
    text: `🎀超マイルド。濃度は抑えめでシカや保湿で荒れにくい。

攻めたいけど荒れたくない人向け

スピードはAnuaに劣るけど、じわじわキメUPできてる🎀 https://amzn.to/3K7k1oq`,
    // image: 'images/follower-growth/innisfree-reti.jpg'
    image: ''
  },
  {
    title: 'エクセル ベース×クレド下地 比較',
    text: `🎀朝から昼過ぎも毛穴スッ、肌もちもち。乾燥ヨレ体質でも夜まで崩れにくい。

クレド愛用してたけど、エクセルでも体感ほぼ一緒。差額は正直バグだよ🎀 https://amzn.to/48mBORK`,
    // image: 'images/follower-growth/excel-base.jpg'
    image: ''
  },
  {
    title: 'Anua ビタミン10 PORESTRIX 本音レビュー',
    text: `🎀高濃度VCで即トーンUPできた。毛穴や黒ずみもクリア感。

サポート成分で安定感◎。コスパ的にも試す価値あるよ🎀 https://amzn.to/4oPrE20`,
    // image: 'images/follower-growth/anua-vitamin-serum.jpg'
    image: ''
  },
  {
    title: 'オバジC25 本音レビュー',
    text: `🎀段違いの効果

即効性◎で、毛穴やくすみやハリやシワにがっつり効いた。

高価だけど攻めたい人に最適だよ🎀 https://amzn.to/4o2lnP6`,
    // image: 'images/follower-growth/obagi-C25.jpg'
    image: ''
  },
  {
    title: 'トリデン ブライトニングアンプル 本音レビュー',
    text: `🎀とろみ×低刺激で毎日使いやすい！敏感肌でも◎。

保湿やツヤの延長でじわ明るくなった！🎀　https://amzn.to/44k8KIa`,
    // image: 'images/follower-growth/Torriden-serum.jpg'
    image: ''
  },
  {
    title: 'リデンス『コレクターアンプル』抗酸化セラム 本音レビュー',
    text: `抗酸化成分多めでトーンUPや透明感を実感！美白や色ムラに◎。

🎀抗酸化効果で透明感増した！

朝もOKだけど乾燥肌は保湿足し推奨。軽く浸透、ベタつきなしだよ🎀　https://amzn.to/4pCUi6D`,
    // image: 'images/follower-growth/Redence-Ampoule.jpg'
    image: ''
  },
  {
    title: 'リデンス『コレクターアンプル』',
    text: `🎀現実的な美白できた！

深いシミや肝斑は完全には消えないけど、同価格帯より体感は高水準。

メガ割ならコスパ激強、今買う価値あるよ🎀`,
    image: 'images/follower-growth/Redence-Ampoule.jpg'
  },
  {
    title: 'メディキューブ AGE-R ブースタープロ 本音レビュー',
    text: `🎀美容液の入りが段違い。パック上から当てる使い方も◎。

効果を底上げしつつ、小ジワやむくみケアにもマルチに対応。強度調整OKで自分仕様にできるよ🎀　https://amzn.to/4oXAavR`,
    // image: 'images/follower-growth/medicupe-pro.jpg'
    image: ''
  },
  {
    title: 'メディキューブ PDRNピンクアンプル',
    text: `乾燥の毛穴目立ちはマジでコレ。肌プリプリになって毛穴消える🎀 https://amzn.to/4qVnbfK`,
    // image: 'images/follower-growth/medicube-pink-peptide-serum.jpg'
    image: ''
  },
  {
    title: 'リジュラン公式 REJURAN ゴールドセット',
    text: `🎀高校の頃から悩んでたプツプツが1週間で超綺麗になくなった！

肌のざらつき消えて、使い出してからメイクノリめちゃくちゃ良い🥹🥹

マジこれ一生使う。水越みさと様が使ってるのも納得だよ🎀 https://amzn.to/3Lt8yzY`,
    // image: 'images/follower-growth/rejuran-gold-set.jpg'
    image: ''
  },
  {
    title: 'トリデン セルメイジング コラーゲン リップエッセンス',
    text: `🎀リップエッセンス使ってみた！

うるおい、ハリ、弾力ヤバい。唇に優しく密着してベタつかず、なめらかな仕上がりになった。

1本で唇の乾燥をケアできて、うるおい弾むようなぷるんとした唇になったよ🎀 https://amzn.to/4oZXAjS`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: 'トリデン Torriden ダイブインマスク',
    text: `🎀つっぱり感じたらコレ使ってる！

とにかく保湿！複数の分子サイズのヒアルロン酸が肌を徹底的に潤してくれる。

パック後は内側からふかふかのモチ肌になって、乾燥知らずになったよ🎀 https://amzn.to/3JPmHH8`,
    // image: 'images/follower-growth/hyaluronic-serum-pack.jpg'
    image: ''
  },
  {
    title: 'トリデン Torriden バランスフルシカ マスク',
    text: `🎀ゆらぎ肌の救世主になった！

生理前やうっかり日焼け後、肌のバランスが崩れた時に助かる

CICA配合で敏感になった肌をいたわってくれて、荒れにくくなったよ🎀 https://amzn.to/3WLD4HO`,
    // image: 'images/follower-growth/cica-serum-pack.jpg'
    image: ''
  },
  {
    title: 'トリデン(Torriden) セルメイジング ビタC ブライトニングマスク',
    text: `🎀透明感の化身になれた！

たっぷりのビタミンCと話題の美容成分がてんこもり。

パック後は肌のトーンが整って内側から輝く水光肌になった。低刺激だから敏感肌でも使えるのが神🎀 https://amzn.to/4853eLN`,
    // image: 'images/follower-growth/vitamin-c-serum-pack.jpg'
    image: ''
  },
  {
    title: 'トリデン シカクリーム',
    text: `🎀シカクリーム使ってみた！

水分感たっぷりのジェルテクスチャーで使い心地最高すぎた…！

鎮静効果だけでなく油分・水分のバランスまで整えてくれるのが最高🎀　https://amzn.to/3WMbhH3`,
    // image: 'images/follower-growth/torriden-cream.jpg'
    image: ''
  },
  {
    title: 'トリデン ソリッドイン リップエッセンス',
    text: `🎀寝る前のリップマスクとして使ってる💤

くちびる乾燥しやすいので夜の保湿は欠かせない！

こっくり系でしっかり潤って、朝起きたらぷるん唇になってる。ストックあと5本ある笑🎀 https://amzn.to/4osgBvj`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: '',
    text: `🎀ダルバ ホワイトトリュフ スプレーセラム使ってみた！

香りが高級化粧品で気品を感じる🎀
とにかく手軽♥スプレーするだけでトナー+ミスト+セラム+エッセンスをまとめて一度にケアできる！
メイクの上から使うのもOKで日中の保湿ケアにもおすすめ🎀 https://amzn.to/4qOThcV`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: 'ナンバーズイン ヒノキ水81%シートマスク',
    text: `🎀1番のヒノキ水マスク使ってみた！

たっぷり水分系で優しく肌を整えてくれる。

ゲル状のテクスチャーで、みずみずしい美容成分をたっぷりお肌に！🎀 https://amzn.to/43k0Jmc`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: 'ナンバーズイン うるもち65%コラーゲンシートマスク',
    text: `🎀2番使ってみた！

とにかく肌にハリを与えてくれて、ぷるぷる！

ゼリーのような質感で保湿してくれて肌の角層をコラーゲンや保湿成分で埋めてくれる感覚♡

ナンバーズインの他のと比較しても圧倒的な保湿感🎀 https://amzn.to/49P8nsC`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: 'ナンバーズイン すべすべキメケアシートマスク',
    text: `🎀3番使ってみた！

話題の「毛穴が開いているほどピリピリする」やつ！

ナンバーズイン公式の調査では毛穴の開きが39％改善されるというデータもあるらしい、毛穴の超特化型マスク♡

https://amzn.to/4oUQVHC`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: 'ナンバーズイン ひんやりクーリングシートマスク',
    text: `🎀4番使ってみた！

ハーブがたくさん混ざった茶色いシートマスクの緊急SOSパック♡

肌に乗せた瞬間ひんやりで、肌温度を一気に下げてくれる！

すっきりとした使い心地・保湿成分・水分で、突然の肌荒れも整えてくれる。🎀 https://amzn.to/3JpFiJR`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: 'ナンバーズイン 白玉グルタチオンCふりかけマスク',
    text: `🎀5番使ってみた！

赤み・黄ぐすみ・黒ずみの3つの方向から肌トーンを均一にしてくれる。

ビタミンCがたっぷり配合されているのでみずみずしく肌のくすみを飛ばし、1トーン明るいキラキラ肌にしてくれる🎀 https://amzn.to/3JOmKmB`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: '組み合わせ｜fwee(フィー) スパグロウUVトーンアップベース × ホワイトトリュフファーストスプレーセラム',
    text: `🎀全然崩れなくて艶キープできて最高！

私乾燥肌なのですが、全然崩れなくて艶キープできて最高でした。

もっと早く知っていれば、、 https://amzn.to/4pkQ9UL`,
    // image: 'images/follower-growth/torriden-lip-essence.jpg'
    image: ''
  },
  {
    title: '🎀スキンケア成分の効果メモ',
    text: `

ビタミンC誘導体→ 朝、紫外線ダメージをブロック。洗顔後すぐで日焼け止め必須。

レチノール→ 夜、ターンオーバー促進。週2〜3回からスタートして保湿と併用。

ナイアシンアミド→ 朝・夜、美白・ハリ・皮脂ケア万能。ビタミンC・レチノールとも相性◎🎀`,
    image: ''
  },
  {
    title: '🎀スキンケア成分の効果メモ',
    text: `

ハイドロキノン→ 夜・短期、シミ集中ケア。部分使いで4〜8週間が目安。終了後は鎮静ケア。

トラネキサム酸→ 朝・夜、炎症を抑えて色素沈着予防。長期使用OKで敏感肌にも◎。

サリチル酸→ 夜・週1〜2回、角質除去・ニキビ予防。酸系の重ね使いは避けて🎀`,
    image: ''
  },
  {
    title: '🎀スキンケア成分の効果メモ',
    text: `

PHA→ 朝・夜、穏やかな角質ケア。敏感肌向けで朝にも使える。他の酸系より刺激が少なくて続けやすい。

アスタキサンチン→ 朝、抗酸化力が高く、サプリ＋美容液のW使いで内外ケア。紫外線ダメージから守ってくれる🎀`,
    image: ''
  },
  {
    title: '🎀スキンケア成分の効果メモ',
    text: `

セラミド→ 朝・夜、保湿の要。洗顔後すぐ塗ると水分密閉効果UP。乾燥肌には必須の成分。

グリシルグリシン→ 夜、毛穴引き締め。冷蔵で冷やしてTゾーン中心に使うと効果的。毛穴が気になる人におすすめ🎀`,
    image: ''
  }
];

