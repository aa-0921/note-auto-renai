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

export const posts = [
//   {
//     title: 'Anua全シリーズ本音レビュー',
//     text: `【Anua総評】使い切って分かった指名買いリスト。

// 乾燥→PDRN。跡/毛穴/ハリ→レチ0.3。皮脂/赤み→アゼ15。速攻トーンUP/毛穴→ビタミン10。色素沈着→ダークスポット。透明感/ツヤ→桃70。揺らぎ→ドクダミ80。

// 肌悩み別に選べばハズさない。迷ったらまず“土台”から整えるのが近道。`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   }
//   ,
//   {
//     title: 'Anua｜PDRNヒアルロン酸カプセル100セラム本音レビュー',
//     text: `【水分ロックが段違い】💧\n\n内側しっとり、外側さらり。PDRN×ヒアルロン酸で一日中つっぱらない。\n\n3本使い切りで生理前も荒れにくく、乾燥小ジワふっくら。乾燥肌/インナードライの土台ケアに最適。\n\n結論：安定感が正義。買うならまずコレ。\n\n#Anua #PDRN`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: 'Anua｜レチノール0.3ナイアシンリニューイングセラム',
//     text: `【速攻で実感】⚡️\n\nレチ0.3×ナイアシン×セラミドで多角アプローチ。\n\n跡/毛穴/ハリ不足をケア。ざらつき消え、キメが詰まり輪郭シャープ。\n\n夜は少量→保湿重ねで刺激最小。攻めたい夜に。\n\n#レチノール #毛穴ケア`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: 'Anua｜アゼライン酸15インテンスカーミングセラム',
//     text: `【皮脂の切り札】🛡️\n\nアゼライン酸15%で朝のテカり・夕方のベタつき激減。\n\n赤み/ニキビ/跡にもマルチに効く。Tゾーンの崩れが減って触り心地つるん。\n\n結論：詰まらせない・増やさない。脂性/混合の味方。\n\n#アゼライン酸`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: 'Anua｜ビタミン10 PORESTRIXセラム（新作）',
//     text: `【毛穴キュッ、トーンUP】🍋\n\n使ってすぐ明るさが一段上がる速攻型。\n\nキメが締まり黒ずみが目立ちにくい。ピリつきにくく毎日ケアに◎。\n\nメイク前1滴で下地いらずのクリア感。写真映えも狙える。\n\n#ビタミンC #毛穴ケア`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: 'Anua｜ダークスポットセラム',
//     text: `【色素沈着に狙い撃ち】🎯\n\nナイアシン10%×トラネキサム4%。\n\n跡/シミ/そばかすの“残る影”を点で狙い面で晴らす。\n\nまず部分塗り→全顔。停滞してた色ムラに手応え。\n\n#ダークスポット`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: 'Anua｜桃70ナイアシンセラム',
//     text: `【ぷるツヤ透明感】🍑\n\nとろける質感で内側から発光。継続でワントーン明るく、メイク密着もUP。\n\n保湿×ブライトニングのバランス良し。脂性肌は量控えめに。\n\n結論：可愛い質感が続くご褒美。香りも心地よい。\n\n#桃セラム`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: 'Anua｜ドクダミ80モイスチャースージングアンプル',
//     text: `【先回り鎮静】🌿\n\n季節の変わり目や生理前に“まずこれ”。\n\n赤み・ヒリつき前夜を落ち着かせ、保水力も底上げ。\n\n優しいのに結果◎。肌が荒れそうなサインに即投入。\n\n#ドクダミ`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: '組み合わせ｜レチノール × アゼライン酸（ニキビ特化）',
//     text: `【増やさない×消す】🧩\n\n皮脂過多・詰まりやすい人に。\n\n朝/夜はアゼ、夜にレチで回転UP。テカり減ってつるん肌へ。\n\n保湿＋UVで刺激ケアも万全。使い分けが勝ち筋。\n\n#レチノール #アゼライン酸`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: '組み合わせ｜ドクダミ × アゼライン酸（荒れ/赤み）',
//     text: `【鎮静＋皮脂抑制】🧘‍♀️\n\n赤みが出やすい/思春期ニキビに。\n\nドクダミで土台を落ち着かせ、アゼで皮脂と菌バランスを整える。\n\n敏感時はドクダミ多め→慣れたらアゼ増量。荒れ癖リセット。\n\n#鎮静 #赤みケア`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: '組み合わせ｜ダークスポット × レチノール（跡/シミ）',
//     text: `【点に効かせ面で晴らす】🎯\n\nダークスポットで生成抑制、レチで回転UP。\n\n跡の“残る影”が均一に薄く。夜は交互or重ね、日中はUV徹底。\n\n結論：美白と跡ケアを同時に。効かせ方が肝。\n\n#シミケア #ニキビ跡`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: '組み合わせ｜PDRN × レチノール（ハリ/弾力）',
//     text: `【ふわもち弾力】🫧\n\nPDRNで水分土台→レチで回転UP。\n\nふっくら感とリフト感を両取り。乾燥小ジワも浅く。\n\n結論：やわらかいのにシャープ。触れたくなる質感へ。\n\n#ハリ弾力 #PDRN`,
//     image: 'images/follower-growth/anua-serum.jpg'
//   },
//   {
//     title: 'VT PDRN+カプセルクリーム100',
//     text: `【しっかり潤うが、量には注意】

// 乾燥は感じず、体感ではキールズよりもしっとり。

// ただ5日連続で“多め”に使ったらニキビ発生。量を盛りがちな人・できやすい人は控えめ推奨。

// 分かったのは「潤いはあるが水分の持続は低め」。一方でAnuaは潤い量では劣るものの、内側がずっと満ちる感じで総合点は上。

// メイクノリはVTが飛び抜けて良い。けれど他は突出なし。あの一斉絶賛は広告寄り？メガ割前にまた持ち上がったら確度高め。

// #VTコスメ #PDRN #保湿クリーム #正直レビュー`,
//     image: 'images/follower-growth/vt-pdrm-capsule-cream.jpg'
//   },
  {
    title: 'numbuzin No.5（ナンバーズイン5番）セラム 本音レビュー',
    text: `【numbuzin No.5 セラム】

成分配合は標準的。
テクスチャはこっくり、伸びは良好。
効果実感→即効性は控えめ。

翌朝ふっくら、トーンは均一。こっくりだけど意外と浸透。乾燥肌向け。敏感肌は刺激を感じるかも。重ねる量は控えめ推奨。保湿ブースターとしては“可”。即効性や劇的変化は期待しすぎないのが◎。

#numbuzin #セラム #乾燥肌 #スキンケアレビュー`,
    image: 'images/follower-growth/numbuzin-5.jpg'
    // image: null
  }
];

