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
    text: `【Anua総評】使い切って分かった指名買いリスト。

乾燥→PDRN。跡/毛穴/ハリ→レチ0.3。皮脂/赤み→アゼ15。速攻トーンUP/毛穴→ビタミン10。色素沈着→ダークスポット。透明感/ツヤ→桃70。揺らぎ→ドクダミ80。

肌悩み別に選べばハズさない。`,
    image: 'images/follower-growth/anua-serum.jpg'
  }
  ,
  {
    title: 'Anua｜PDRNヒアルロン酸カプセル100セラム本音レビュー',
    text: `【水分ロックが段違い】💧\n\n内側しっとり、外側さらり。PDRN×ヒアルロン酸で一日中つっぱらない。\n\n3本使い切りで生理前も荒れにくく、乾燥小ジワふっくら。\n\n結論：安定感が正義。買うならまずコレ。\n\n#Anua #PDRN`,
    image: 'images/follower-growth/anua-pdrn-hyaluron-serum.jpg'
  },
  {
    title: 'Anua｜レチノール0.3ナイアシンリニューイングセラム',
    text: `【速攻で実感】⚡️\n\nレチ0.3×ナイアシン×セラミドで多角アプローチ。\n\n跡/毛穴/ハリ不足をケア。ざらつき消え、キメが詰まり輪郭シャープ。\n\n夜は少量→保湿重ねで刺激最小。攻めたい夜に。\n\n#レチノール #毛穴ケア`,
    image: 'images/follower-growth/ANUA-reti.jpg'
  },
  {
    title: 'Anua｜アゼライン酸15インテンスカーミングセラム',
    text: `【皮脂の切り札】🛡️\n\nアゼライン酸15%で朝のテカり・夕方のベタつき激減。\n\n赤み/ニキビ/跡にもマルチに効く。Tゾーンの崩れが減って触り心地つるん。\n\n結論：詰まらせない・増やさない。脂性/混合の味方。\n\n#アゼライン酸`,
    image: 'images/follower-growth/anua-azelaic-serum.jpg'
  },
  {
    title: 'Anua｜ビタミン10 PORESTRIXセラム',
    text: `【毛穴キュッ、トーンUP】🍋\n\n使ってすぐ明るさが一段上がる速攻型。\n\nキメが締まり黒ずみが目立ちにくい。ピリつきにくく毎日ケアに◎。\n\nメイク前1滴で下地いらずのクリア感。写真映えも狙える。\n\n#ビタミンC #毛穴ケア`,
    image: 'images/follower-growth/anua-vitamin-serum.jpg'
  },
  {
    title: 'Anua｜ダークスポットセラム',
    text: `【色素沈着に狙い撃ち】🎯\n\nナイアシン10%×トラネキサム4%。\n\n跡/シミ/そばかすの“残る影”を点で狙い面で晴らす。\n\nまず部分塗り→全顔。停滞してた色ムラに手応え。　👉https://amzn.to/47qLyd \n\n#ダークスポット`,
    image: 'images/follower-growth/anua-niacinamide-txa-serum.jpg'
  },
  {
    title: 'Anua｜桃70ナイアシンセラム',
    text: `【ぷるツヤ透明感】🍑\n\nとろける質感で内側から発光。継続でワントーン明るく、メイク密着もUP。\n\n保湿×ブライトニングのバランス良し。脂性肌は量控えめに。\n\n結論：可愛い質感が続くご褒美。香りも心地よい。\n\n#桃セラム`,
    image: 'images/follower-growth/anua-peach-niacin-serum.jpg'
  },
  {
    title: 'Anua｜ドクダミ80モイスチャースージングアンプル',
    text: `【先回り鎮静】🌿\n\n季節の変わり目や生理前に“まずこれ”。\n\n赤み・ヒリつき前夜を落ち着かせ、保水力も底上げ。\n\n優しいのに結果◎。肌が荒れそうなサインに即投入。\n\n#ドクダミ`,
    image: 'images/follower-growth/anua-dokudami-heartleaf-serum.jpg'
  },
  {
    title: '組み合わせ｜レチノール × アゼライン酸（ニキビ特化）',
    text: `【増やさない×消す】🧩\n\n皮脂過多・詰まりやすい人に。\n\n朝/夜はアゼ、夜にレチで回転UP。テカり減ってつるん肌へ。\n\n保湿＋UVで刺激ケアも万全。使い分けが勝ち筋。\n\n#レチノール #アゼライン酸`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: '組み合わせ｜ドクダミ × アゼライン酸（荒れ/赤み）',
    text: `【鎮静＋皮脂抑制】🧘‍♀️\n\n赤みが出やすい/思春期ニキビに。\n\nドクダミで土台を落ち着かせ、アゼで皮脂と菌バランスを整える。\n\n敏感時はドクダミ多め→慣れたらアゼ増量。荒れ癖リセット。\n\n#鎮静 #赤みケア`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: '組み合わせ｜ダークスポット × レチノール（跡/シミ）',
    text: `【点に効かせ面で晴らす】🎯\n\nダークスポットで生成抑制、レチで回転UP。\n\n跡の“残る影”が均一に薄く。夜は交互or重ね、日中はUV徹底。\n\n結論：美白と跡ケアを同時に。効かせ方が肝。\n\n#シミケア #ニキビ跡`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: '組み合わせ｜PDRN × レチノール（ハリ/弾力）',
    text: `【ふわもち弾力】🫧\n\nPDRNで水分土台→レチで回転UP。\n\nふっくら感とリフト感を両取り。乾燥小ジワも浅く。\n\n結論：やわらかいのにシャープ。触れたくなる質感へ。\n\n#ハリ弾力 #PDRN`,
    image: 'images/follower-growth/anua-serum.jpg'
  },
  {
    title: 'VT PDRN+カプセルクリーム100',
    text: `【潤うが量注意】

キールズ以上のしっとり。多め連用でニキビ出たので少量推奨。潤いは高いが持続弱め、メイクノリはVT◎。

#VT #PDRN #保湿 #クリーム #ドラコス #正直レビュー #乾燥肌`,
    image: 'images/follower-growth/vt-pdrm-capsule-cream.jpg'
  },
  {
    title: 'numbuzin No.5（ナンバーズイン5番）セラム 本音レビュー',
    text: `【No.5 セラム】

標準処方・こっくり質感。翌朝ふっくら、即効性は控えめ。乾燥肌向け、敏感肌は様子見。

#numbuzin #5番 #セラム #乾燥肌 #トーンアップ #スキンケア #レビュー`,
    image: 'images/follower-growth/numbuzin-5.jpg'
  },
  {
    title: 'クオリティファースト ウルセラC 本音レビュー',
    text: `【ウルセラC】

肌なじみ○、保湿やや弱め。軽質感でベタつかず、乾燥肌はクリーム併用推奨。淡く効く継続タイプ。

#クオリティファースト #ウルセラC #VC #美容液 #ドラコス #正直レビュー #乾燥肌`,
    image: 'images/follower-growth/Quality-1st.jpg'
  },
  {
    title: 'メラノCC プレミアム美容液 本音レビュー',
    text: `【メラノCC】

プチプラで入手◎。オイル感と香りは好み分かれる。部分使いで効果実感、全顔は油膜感あり。コスパ重視に◎。

#メラノCC #ビタミンC #部分使い #ドラコス #毛穴 #シミ #コスパ`,
    image: 'images/follower-growth/merano-cc.jpg'
  },
  {
    title: 'Anua レチノール0.3% ナイアシンセラム 本音レビュー',
    text: `【攻めの0.3%レチ】

レチ0.3%×ナイアシンで毛穴・シワ・トーンUP。初期はピリつき/乾燥→隔日・少量・保湿厚め。慣れるとハリ実感。

#Anua #レチノール #ナイアシンアミド #毛穴 #ハリ #エイジング #夜ケア`,
    image: 'images/follower-growth/ANUA-reti.jpg'
  },
  {
    title: 'Innisfree レチノールシカ 本音レビュー',
    text: `【レチノールシカ】

超マイルド。濃度は抑えめ(推定0.025〜0.1%)＋シカ/保湿で荒れにくい。夜→朝でしっとり整う。「攻めたいけど荒れたくない」人向け。スピードはAnuaに劣るが、じわじわキメUP。

#Innisfree #レチノール #シカ #敏感肌 #夜ケア #じわ効き #キメ #保湿 #初心者`,
    image: 'images/follower-growth/innisfree-reti.jpg'
  },
  {
    title: 'エクセル ベース×クレド下地 比較',
    text: `【下地比較】

朝→昼過ぎも毛穴スッ、肌もちもち。乾燥ヨレ体質でも夜まで崩れにくい。クレド(¥8,250)愛用→エクセル(¥1,870)でも体感ほぼ一緒。差額¥6,380は正直バグ。

#下地 #エクセル #クレド #毛穴 #乾燥肌 #崩れにくい #コスパ #ドラコス`,
    image: 'images/follower-growth/excel-base.jpg'
  },
  {
    title: 'Anua ビタミン10 PORESTRIX 本音レビュー',
    text: `【ビタミン10】

高濃度VCで即トーンUP。毛穴/黒ずみもクリア感。サポート成分で安定感◎。ややベタつきありだが、効果重視なら買い。コスパ的にも試す価値。

#Anua #ビタミンC #毛穴 #黒ずみ #トーンアップ #コスパ #正直レビュー`,
    image: 'images/follower-growth/anua-vitamin-serum.jpg'
  },
  {
    title: 'オバジC25 本音レビュー',
    text: `【オバジC25】

即効性◎。毛穴・くすみ・ハリ・シワにガツン。刺激/ベタつきあり→敏感/オイリーは様子見。高価だが“攻めたい人”に最適。

#オバジ #C25 #ビタミンC #毛穴 #くすみ #ハリ #シワ #攻めケア #正直レビュー`,
    image: 'images/follower-growth/obagi-C25.jpg'
  },
  {
    title: 'トリデン ブライトニングアンプル 本音レビュー',
    text: `【トリデン アンプル】

とろみ×低刺激で毎日使いやすい。敏感肌でも◎。ビタミンCの効きは穏やかで、保湿/ツヤの延長で“じわ明るい”。劇的変化より安定重視の人に。

#トリデン #ビタミンC #美白 #低刺激 #敏感肌 #ツヤ #保湿 #韓国コスメ #毎日ケア`,
    image: 'images/follower-growth/Torriden-serum.jpg'
  },
  {
    title: 'リデンス『コレクターアンプル』抗酸化セラム 本音レビュー',
    text: `【抗酸化でじわ透明感】

抗酸化成分多めでトーンUP/透明感を実感。美白・色ムラに◎。朝もOKだが乾燥肌は保湿足し推奨。軽く浸透、ベタつきなし。
👉https://amzn.to/4945wMk
#抗酸化 #美白 #透明感 #色ムラ #朝ケア #軽い使用感`,
    image: 'images/follower-growth/Redence-Ampoule.jpg'
  },
  {
    title: 'リデンス『コレクターアンプル』',
    text: `【現実的な美白】

深いシミ/肝斑は完全には消えないが、同価格帯より体感は高水準。メガ割ならコスパ激強、今買う価値あり。

#美白 #シミケア #肝斑 #韓国コスメ #メガ割 #コスパ`,
    image: 'images/follower-growth/Redence-Ampoule.jpg'
  },
  {
    title: 'メディキューブ AGE-R ブースタープロ 本音レビュー',
    text: `【ブースターで浸透最大化】

美容液の入りが段違い。粒子が大きめなPDRN系とも好相性。パック上から当てる使い方も◎。効果を底上げしつつ、小ジワ/むくみケアにもマルチに対応。強度調整OKで自分仕様に。

#メディキューブ #AGER #ブースタープロ #ブースター #浸透 #PDRN #小ジワ #むくみ #スキンケアギア`,
    image: 'images/follower-growth/medicupe-pro.jpg'
  }
];

