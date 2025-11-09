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

// - ハッシュタグは多め
// - title/textを合わせて 全角140文字（半角280文字）に収まるように
// - 適度に改行を入れて読みやすく

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
    text: `🎀水分ロックが段違いになった！

内側しっとり、外側さらり。PDRN×ヒアルロン酸で一日中つっぱらないよ。

3本使い切りで生理前も荒れにくくなって、乾燥小ジワもふっくらしてきた。

安定感が正義だよ。買うならまずコレ🎀`,
    image: 'images/follower-growth/anua-pdrn-hyaluron-serum.jpg'
  },
  {
    title: 'Anua｜レチノール0.3ナイアシンリニューイングセラム',
    text: `🎀速攻で実感できた！

レチ0.3×ナイアシン×セラミドで多角アプローチ。

跡や毛穴やハリ不足をケアして、ざらつき消えてキメが詰まって輪郭がシャープになった。

夜は少量で保湿重ねて刺激最小。攻めたい夜に使ってる🎀`,
    image: 'images/follower-growth/ANUA-reti.jpg'
  },
  {
    title: 'Anua｜アゼライン酸15インテンスカーミングセラム',
    text: `🎀皮脂の切り札になった！

アゼライン酸15%で朝のテカりや夕方のベタつきが激減したよ。

赤みやニキビや跡にもマルチに効いて、Tゾーンの崩れが減って触り心地つるん。

詰まらせないし増やさない。脂性や混合の味方だよ🎀`,
    image: 'images/follower-growth/anua-azelaic-serum.jpg'
  },
  {
    title: 'Anua｜ビタミン10 PORESTRIXセラム',
    text: `🎀毛穴キュッ、トーンUPできた！

使ってすぐ明るさが一段上がる速攻型。

キメが締まって黒ずみが目立ちにくくなった。ピリつきにくくて毎日ケアに使ってる。

メイク前1滴で下地いらずのクリア感。写真映えも狙えるよ🎀`,
    image: 'images/follower-growth/anua-vitamin-serum.jpg'
  },
  {
    title: 'Anua｜ダークスポットセラム',
    text: `🎀色素沈着に狙い撃ちできた！

ナイアシン10%×トラネキサム4%。

跡やシミやそばかすの残る影を点で狙って面で晴らしてる。

まず部分塗りから全顔に。停滞してた色ムラに手応えがあったよ🎀`,
    image: 'images/follower-growth/anua-niacinamide-txa-serum.jpg'
  },
  {
    title: 'Anua｜桃70ナイアシンセラム',
    text: `🎀ぷるツヤ透明感になった！

とろける質感で内側から発光してる。

継続でワントーン明るくなって、メイク密着もUPしたよ。

保湿×ブライトニングのバランス良し。脂性肌は量控えめにしてる。

可愛い質感が続くご褒美。香りも心地よい🎀`,
    image: 'images/follower-growth/anua-peach-niacin-serum.jpg'
  },
  {
    title: 'Anua｜ドクダミ80モイスチャースージングアンプル',
    text: `🎀先回り鎮静できた！

季節の変わり目や生理前にまずこれを使ってる。

赤みやヒリつき前夜を落ち着かせて、保水力も底上げできたよ。

優しいのに結果◎。肌が荒れそうなサインに即投入してる🎀`,
    image: 'images/follower-growth/anua-dokudami-heartleaf-serum.jpg'
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
    text: `🎀潤うけど量に注意！

キールズ以上のしっとりになった。

多め連用でニキビ出たから少量推奨。潤いは高いけど持続弱め、メイクノリはVT◎。

使ってみて分かったよ🎀`,
    image: 'images/follower-growth/vt-pdrm-capsule-cream.jpg'
  },
  {
    title: 'numbuzin No.5（ナンバーズイン5番）セラム 本音レビュー',
    text: `🎀No.5セラム使ってみた！

標準処方でこっくり質感。翌朝ふっくら、即効性は控えめ。

乾燥肌向けで、敏感肌は様子見してる。

使ってみて分かったよ🎀`,
    image: 'images/follower-growth/numbuzin-5.jpg'
  },
  {
    title: 'クオリティファースト ウルセラC 本音レビュー',
    text: `🎀ウルセラC使ってみた！

肌なじみ良くて、保湿やや弱め。軽質感でベタつかず、乾燥肌はクリーム併用推奨。

淡く効く継続タイプだよ。

使ってみて分かった🎀`,
    image: 'images/follower-growth/Quality-1st.jpg'
  },
  {
    title: 'メラノCC プレミアム美容液 本音レビュー',
    text: `🎀メラノCC使ってみた！

プチプラで入手できた。オイル感と香りは好み分かれる。

部分使いで効果実感できて、全顔は油膜感ある。コスパ重視に◎だよ🎀`,
    image: 'images/follower-growth/merano-cc.jpg'
  },
  {
    title: 'Anua レチノール0.3% ナイアシンセラム 本音レビュー',
    text: `🎀攻めの0.3%レチ使ってる！

レチ0.3%×ナイアシンで毛穴やシワやトーンUPできた。

初期はピリつきや乾燥したから隔日で少量で保湿厚め。慣れるとハリ実感できたよ🎀`,
    image: 'images/follower-growth/ANUA-reti.jpg'
  },
  {
    title: 'Innisfree レチノールシカ 本音レビュー',
    text: `🎀レチノールシカ使ってみた！

超マイルド。濃度は抑えめでシカや保湿で荒れにくい。

夜から朝でしっとり整った。攻めたいけど荒れたくない人向け。

スピードはAnuaに劣るけど、じわじわキメUPできてる🎀`,
    image: 'images/follower-growth/innisfree-reti.jpg'
  },
  {
    title: 'エクセル ベース×クレド下地 比較',
    text: `🎀下地比較してみた！

朝から昼過ぎも毛穴スッ、肌もちもち。乾燥ヨレ体質でも夜まで崩れにくい。

クレド愛用してたけど、エクセルでも体感ほぼ一緒。差額は正直バグだよ🎀`,
    image: 'images/follower-growth/excel-base.jpg'
  },
  {
    title: 'Anua ビタミン10 PORESTRIX 本音レビュー',
    text: `🎀ビタミン10使ってみた！

高濃度VCで即トーンUPできた。毛穴や黒ずみもクリア感。

サポート成分で安定感◎。ややベタつきあるけど、効果重視なら買い。

コスパ的にも試す価値あるよ🎀`,
    image: 'images/follower-growth/anua-vitamin-serum.jpg'
  },
  {
    title: 'オバジC25 本音レビュー',
    text: `🎀オバジC25使ってみた！

即効性◎。毛穴やくすみやハリやシワにガツンと効いた。

刺激やベタつきあるから敏感やオイリーは様子見。高価だけど攻めたい人に最適だよ🎀`,
    image: 'images/follower-growth/obagi-C25.jpg'
  },
  {
    title: 'トリデン ブライトニングアンプル 本音レビュー',
    text: `🎀トリデンアンプル使ってる！

とろみ×低刺激で毎日使いやすい。敏感肌でも◎。

ビタミンCの効きは穏やかで、保湿やツヤの延長でじわ明るくなった。

劇的変化より安定重視の人に🎀`,
    image: 'images/follower-growth/Torriden-serum.jpg'
  },
  {
    title: 'リデンス『コレクターアンプル』抗酸化セラム 本音レビュー',
    text: `🎀抗酸化でじわ透明感になった！

抗酸化成分多めでトーンUPや透明感を実感できた。美白や色ムラに◎。

朝もOKだけど乾燥肌は保湿足し推奨。軽く浸透、ベタつきなしだよ🎀`,
    image: 'images/follower-growth/Redence-Ampoule.jpg'
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
    text: `🎀ブースターで浸透最大化できた！

美容液の入りが段違いになった。

粒子が大きめなPDRN系とも好相性。パック上から当てる使い方も◎。

効果を底上げしつつ、小ジワやむくみケアにもマルチに対応。強度調整OKで自分仕様にできるよ🎀`,
    image: 'images/follower-growth/medicupe-pro.jpg'
  },
  {
    title: 'メディキューブ PDRNピンクアンプル',
    text: `乾燥の毛穴目立ちはマジでコレ。肌プリプリになって毛穴消える🎀 https://amzn.to/4qVnbfK`,
    image: 'images/follower-growth/medicube-pink-peptide-serum.jpg'
  },
  {
    title: 'リジュラン公式 REJURAN ゴールドセット',
    text: `🎀高校の頃から悩んでたプツプツが1週間で超綺麗になくなった！

肌のざらつき消えて、使い出してからメイクノリめちゃくちゃ良い🥹🥹

マジこれ一生使う。水越みさと様が使ってるのも納得だよ🎀 https://amzn.to/3Lt8yzY`,
    image: 'images/follower-growth/rejuran-gold-set.jpg'
  },
  {
    title: 'トリデン セルメイジング コラーゲン リップエッセンス',
    text: `🎀リップエッセンス使ってみた！

うるおい、ハリ、弾力ヤバい。唇に優しく密着してベタつかず、なめらかな仕上がりになった。

1本で唇の乾燥をケアできて、うるおい弾むようなぷるんとした唇になったよ🎀 https://amzn.to/4oZXAjS`,
    image: 'images/follower-growth/torriden-lip-essence.jpg'
  },
  {
    title: 'トリデン Torriden ダイブインマスク',
    text: `🎀つっぱり感じたらコレ使ってる！

とにかく保湿！複数の分子サイズのヒアルロン酸が肌を徹底的に潤してくれる。

パック後は内側からふかふかのモチ肌になって、乾燥知らずになったよ🎀 https://amzn.to/3JPmHH8`,
    image: 'images/follower-growth/hyaluronic-serum-pack.jpg'
  },
  {
    title: 'トリデン Torriden バランスフルシカ マスク',
    text: `🎀ゆらぎ肌の救世主になった！

生理前やうっかり日焼け後、肌のバランスが崩れた時に助かる

CICA配合で敏感になった肌をいたわってくれて、荒れにくくなったよ🎀 https://amzn.to/3WLD4HO`,
    image: 'images/follower-growth/cica-serum-pack.jpg'
  },
  {
    title: 'トリデン(Torriden) セルメイジング ビタC ブライトニングマスク',
    text: `🎀透明感の化身になれた！

たっぷりのビタミンCと話題の美容成分がてんこもり。

パック後は肌のトーンが整って内側から輝く水光肌になった。低刺激だから敏感肌でも使えるのが神🎀 https://amzn.to/4853eLN`,
    image: 'images/follower-growth/vitamin-c-serum-pack.jpg'
  },
  {
    title: 'トリデン シカクリーム',
    text: `🎀シカクリーム使ってみた！

水分感たっぷりのジェルテクスチャーで使い心地最高すぎた…！

鎮静効果だけでなく油分・水分のバランスまで整えてくれるのが最高🎀　https://amzn.to/3WMbhH3`,
    image: ''
  },
  {
    title: 'トリデン ソリッドイン リップエッセンス',
    text: `🎀寝る前のリップマスクとして使ってる💤

くちびる乾燥しやすいので夜の保湿は欠かせない！

こっくり系でしっかり潤って、朝起きたらぷるん唇になってる。ストックあと5本ある笑🎀 https://amzn.to/4osgBvj`,
    image: ''
  },
  {
    title: 'ダルバ ホワイトトリュフ ファースト スプレーセラム',
    text: `🎀スプレーセラム使ってみた！

ミストタイプだから満遍なくつけられる。香りが高級化粧品のような気品を感じる香り。

つけた瞬間の、自分が高級品になった気分が味わえて、化粧水をつけるのが楽しくなる。

とにかく手軽♥スプレーするだけでトナー+ミスト+セラム+エッセンスをまとめて一度にケアできる！

メイクの上から使っても邪魔をしないので、日中の保湿ケアにもおすすめ🎀 https://amzn.to/4qOThcV`,
    image: ''
  }
];

