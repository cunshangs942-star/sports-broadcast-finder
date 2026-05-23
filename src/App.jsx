import { useState, useMemo } from "react";

const SERVICE_URLS = {
  "DAZN": "https://www.dazn.com/ja-JP/home",
  "DMM×DAZNホーダイ": "https://tv.dmm.com/vod/dazn/",
  "DAZN / DMM×DAZNホーダイ": "https://www.dazn.com/ja-JP/home",
  "U-NEXTサッカーパック": "https://video.unext.jp/feature/soccer",
  "U-NEXT": "https://video.unext.jp/",
  "ABEMA": "https://abema.tv/",
  "Netflix": "https://www.netflix.com/jp/",
  "Amazon Prime Video": "https://www.amazon.co.jp/primevideo",
  "Amazon Prime Video（サッカーLIVEライト）": "https://www.amazon.co.jp/primevideo",
  "Amazon Prime Video（J SPORTS経由）": "https://www.amazon.co.jp/primevideo",
  "NBA League Pass（Amazon Prime Video経由）": "https://www.amazon.co.jp/primevideo",
  "Hulu": "https://www.hulu.jp/",
  "WOWOW": "https://www.wowow.co.jp/",
  "WOWOW / WOWOWオンデマンド": "https://www.wowow.co.jp/",
  "WOWOW（チャンピオンズリーグ）": "https://www.wowow.co.jp/",
  "ABEMA de WOWSPO": "https://abema.tv/",
  "スカパー！": "https://www.skyperfectv.co.jp/",
  "J SPORTSオンデマンド": "https://www.jsports.co.jp/",
  "J SPORTS": "https://www.jsports.co.jp/",
  "フジテレビNEXTsmart / FOD F1プラン": "https://fod.fujitv.co.jp/",
  "フジテレビNEXT（CS放送・スカパー！）": "https://www.skyperfectv.co.jp/",
  "フジテレビ（地上波）": "https://www.fujitv.co.jp/",
  "NHK総合": "https://www.nhk.jp/",
  "NHK BS / 地方局": "https://www.nhk.jp/",
  "NHK BS・地上波各局": "https://www.nhk.jp/",
  "NHK BSプレミアム4K": "https://www.nhk.jp/",
  "NHK": "https://www.nhk.jp/",
  "NHK+": "https://plus.nhk.jp/",
  "日本テレビ": "https://www.ntv.co.jp/",
  "フジテレビ / 日本テレビ": "https://www.fujitv.co.jp/",
  "日テレジータス（CS）": "https://www.ntv.co.jp/",
  "TVerなど": "https://tver.jp/",
  "NBA docomo": "https://nba.smt.docomo.ne.jp/",
};

// ===== 2026年度 放映先データベース =====
// region: "domestic"=国内, "international"=海外, null=区分なし
const DB = {
  // ── サッカー 国内 ──
  "jleague": {
    title: "Jリーグ（J1・J2・J3）", sport: "soccer", region: "domestic",
    season: "2026年（百年構想リーグ）",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "全試合独占配信。DMM×DAZNホーダイは月額3,480円でお得" },
      { name: "ABEMA", type: "free", note: "毎節1〜2試合を無料配信（事前告知なし・会員登録不要）" },
      { name: "NHK BS / 地方局", type: "tv", note: "一部カードのみ地上波・BS放送あり" },
    ],
    tips: "全試合見たいならDAZNが必須。ABEMAは無料で一部視聴可能だが試合は選べない。",
    keywords: ["jリーグ", "j1", "j2", "j3", "jleague", "百年構想", "明治安田", "ジェイリーグ"],
  },
  "japan": {
    title: "サッカー日本代表", sport: "soccer", region: "domestic", isJapan: true,
    season: "2026年",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "W杯・アジア予選など主要試合を配信。日本代表W杯戦は無料" },
      { name: "NHK総合", type: "tv", note: "W杯・一部親善試合を地上波放送" },
      { name: "フジテレビ / 日本テレビ", type: "tv", note: "W杯の一部試合を地上波中継" },
    ],
    tips: "W杯の日本代表戦はDAZNで無料視聴可能。親善試合はNHKや民放でも放送される場合あり。",
    keywords: ["日本代表", "侍ブルー", "サムライブルー", "三笘", "久保", "伊東", "遠藤"],
  },
  // ── UEFA欧州大会 ──
  "championsLeague": {
    title: "UEFAチャンピオンズリーグ（CL）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "全試合独占配信（リーグフェーズ〜決勝）。月額2,530円" },
      { name: "ABEMA de WOWSPO", type: "streaming", note: "ABEMA経由でWOWOWの配信を視聴可能" },
    ],
    tips: "CLはWOWOW独占。EL・ECLも同じ契約で視聴可能。",
    keywords: ["チャンピオンズリーグ", "cl", "champions league", "欧州cl", "uefa cl"],
  },
  "europaLeague": {
    title: "UEFAヨーロッパリーグ（EL）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "全試合配信。CLと同パック。月額2,530円" },
      { name: "ABEMA de WOWSPO", type: "streaming", note: "ABEMA経由で視聴可能" },
    ],
    tips: "ELはWOWOWで配信。CLと同じ契約で視聴可能。",
    keywords: ["ヨーロッパリーグ", "el", "europa league", "uefa el"],
  },
  "conferenceLeague": {
    title: "UEFAカンファレンスリーグ（ECL）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "注目試合を配信。CL・ELと同パック。月額2,530円" },
      { name: "ABEMA de WOWSPO", type: "streaming", note: "ABEMA経由で視聴可能" },
    ],
    tips: "ECLはWOWOWで注目試合を配信。CL・ELと同じ契約で視聴可能。",
    keywords: ["カンファレンスリーグ", "ecl", "conference league", "uefa ecl"],
  },

  // ── イングランド カップ戦 ──
  "faCup": {
    title: "FAカップ（イングランド）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXTサッカーパック", type: "streaming", note: "独占配信。プレミアリーグ・コミュニティシールドと同パック。月額2,600円" },
    ],
    tips: "FAカップはU-NEXT独占。EFLカップ（カラバオカップ）はDAZNで別途視聴。",
    keywords: ["faカップ", "fa cup", "イングランドカップ", "鎌田", "クリスタルパレス"],
  },
  "eflCup": {
    title: "EFLカップ（カラバオカップ）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "独占配信。月額3,480円（DMM×DAZNホーダイ）" },
    ],
    tips: "EFLカップはDAZN独占。FAカップはU-NEXTのため注意。イングランドを全て見るにはDAZN＋U-NEXTの両方が必要。",
    keywords: ["eflカップ", "カラバオカップ", "リーグカップ", "efl cup", "carabao cup"],
  },

  // ── スペイン カップ戦 ──
  "copaDelRey": {
    title: "コパ・デル・レイ（スペイン）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXTサッカーパック", type: "streaming", note: "独占配信。ラ・リーガ・FAカップと同パック。月額2,600円" },
    ],
    tips: "コパ・デル・レイはU-NEXT独占。ラ・リーガと同じパックで視聴できる。",
    keywords: ["コパデルレイ", "copa del rey", "スペインカップ", "スーペルコパ"],
  },

  // ── イタリア カップ戦 ──
  "coppaItalia": {
    title: "コッパ・イタリア / スーペルコッパ（イタリア）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "配信中。セリエAと同パック。月額3,480円（DMM×DAZNホーダイ）" },
    ],
    tips: "コッパ・イタリアはDAZNで配信。セリエAと同じ契約で視聴できる。",
    keywords: ["コッパイタリア", "coppa italia", "イタリアカップ", "スーペルコッパ"],
  },

  // ── ドイツ カップ戦 ──
  "dfbPokal": {
    title: "DFBポカール（ドイツ）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "独占配信。ブンデスリーガと同パック。月額3,480円（DMM×DAZNホーダイ）" },
    ],
    tips: "DFBポカールはDAZN独占。ブンデスリーガと同じ契約で視聴できる。",
    keywords: ["dfbポカール", "dfb pokal", "ドイツカップ", "ドイツカップ戦"],
  },

  // ── フランス カップ戦 ──
  "coupeDefrance": {
    title: "クープ・ドゥ・フランス（フランス）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "配信中。リーグ・アンと同パック。月額3,480円（DMM×DAZNホーダイ）" },
    ],
    tips: "クープ・ドゥ・フランスはDAZNで配信。リーグ・アンと同じ契約で視聴できる。",
    keywords: ["クープドゥフランス", "coupe de france", "フランスカップ"],
  },
  "acl": {
    title: "AFCアジアチャンピオンズリーグ", sport: "soccer", region: "domestic", isJapan: true,
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "配信中" },
    ],
    tips: "DAZNで視聴可能。Jリーグ勢が出場する試合は注目度が高い。",
    keywords: ["acl", "アジアチャンピオンズ", "afc", "アジア", "チャンピオンズリーグ アジア"],
  },

  // ── サッカー 海外 ──
  "premier": {
    title: "プレミアリーグ", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXTサッカーパック", type: "streaming", note: "全試合独占配信。月額2,600円（単体プラン）" },
    ],
    tips: "DAZNは2024-25で配信終了。現在はU-NEXTサッカーパック一択。ラ・リーガも同パックで視聴可能。",
    keywords: ["プレミアリーグ", "premier league", "epl", "イングランド", "プレミア", "マンチェスター", "アーセナル", "リバプール", "三笘"],
  },
  "laliga": {
    title: "ラ・リーガ（スペイン1部）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXTサッカーパック", type: "streaming", note: "全試合独占配信。プレミアリーグと同パック。月額2,600円" },
    ],
    tips: "プレミアリーグと同じU-NEXTサッカーパックで視聴可能。",
    keywords: ["ラ・リーガ", "laliga", "スペイン", "リーガ", "レアルマドリー", "バルセロナ", "久保建英"],
  },
  "bundesliga": {
    title: "ブンデスリーガ（ドイツ1部）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "Amazon Prime Video（サッカーLIVEライト）", type: "streaming", note: "ブンデスリーガ全試合視聴可能" },
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "一部試合を配信" },
    ],
    tips: "Amazonプライムビデオの「サッカーLIVEライト」オプションでブンデスリーガ全試合視聴可能。",
    keywords: ["ブンデスリーガ", "bundesliga", "ドイツ", "バイエルン", "ドルトムント"],
  },
  "seriea": {
    title: "セリエA（イタリア1部）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "配信中。月額3,480円でお得" },
    ],
    tips: "DAZNで視聴可能。DMM×DAZNホーダイがコスパ良好。",
    keywords: ["セリエa", "serie a", "イタリア", "インテル", "ユベントス", "ミラン", "ナポリ"],
  },
  "ligue1": {
    title: "リーグ・アン（フランス1部）", sport: "soccer", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "配信中" },
    ],
    tips: "DAZNで視聴可能。PSGなどが出場する注目試合も配信。",
    keywords: ["リーグアン", "ligue 1", "フランス", "psg", "パリサンジェルマン"],
  },
  "wcup": {
    title: "FIFAワールドカップ2026", sport: "soccer", region: "international",
    season: "2026年6〜7月",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "全104試合ライブ配信。日本代表戦は全試合無料" },
      { name: "NHK総合", type: "tv", note: "開幕戦・決勝など33試合を地上波生中継" },
      { name: "日本テレビ", type: "tv", note: "日本代表戦1試合含む15試合を地上波中継" },
      { name: "フジテレビ / 日本テレビ", type: "tv", note: "日本代表戦含む10試合を地上波中継" },
      { name: "NHK BSプレミアム4K", type: "tv", note: "録画含め全104試合をカバー" },
    ],
    tips: "日本代表戦はDAZNで無料視聴可能。地上波でも多数の試合が放送されるため日本戦は無料で見られる。",
    keywords: ["ワールドカップ", "w杯", "world cup", "wcup", "fifa"],
  },

  // ── 野球 国内 ──
  "npb": {
    title: "プロ野球（NPB）", sport: "baseball", region: "domestic",
    season: "2026年シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "全試合配信。DAZN BASEBALLプランは月額2,300円" },
      { name: "Hulu", type: "streaming", note: "巨人主催全試合を配信" },
      { name: "スカパー！", type: "streaming", note: "セ・パ各チームのCS専門チャンネルで放送" },
      { name: "NHK BS・地上波各局", type: "tv", note: "注目試合を随時放送。地方局でホームチーム中継あり" },
    ],
    tips: "チームによって配信先が異なる。全チーム見たいならDAZNかスカパーがおすすめ。巨人ファンはHuluも選択肢。",
    keywords: ["プロ野球", "npb", "セリーグ", "パリーグ", "巨人", "阪神", "ソフトバンク", "日本ハム", "ヤクルト", "広島", "中日", "横浜", "楽天", "ロッテ", "西武", "オリックス"],
  },
  "wbc": {
    title: "WBC（ワールドベースボールクラシック）", sport: "baseball", region: "domestic", isJapan: true,
    season: "2026年大会（3月開催・終了）",
    services: [
      { name: "Netflix", type: "streaming", note: "日本国内独占配信。地上波・他サービスでの放送一切なし" },
    ],
    tips: "2026年WBCはNetflix完全独占。地上波・BS・CS含め他チャンネルでの中継はなかった。",
    keywords: ["wbc", "ワールドベースボール", "侍ジャパン", "野球 世界大会"],
  },

  // ── 野球 海外 ──
  "mlb": {
    title: "MLB（米大リーグ）", sport: "baseball", region: "international",
    season: "2026年シーズン",
    services: [
      { name: "Amazon Prime Video", type: "streaming", note: "開幕戦・侍ジャパン関連など一部試合を配信" },
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "一部試合を配信" },
    ],
    tips: "全試合視聴は「MLB.TV」（公式）の契約が必要な場合あり。大谷・山本など日本人選手の試合は注目度高い。",
    keywords: ["mlb", "メジャーリーグ", "大リーグ", "大谷", "ドジャース", "山本由伸", "今永"],
  },

  // ── バスケ 国内 ──
  "bLeague": {
    title: "Bリーグ（B1・B2）", sport: "basketball", region: "domestic",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXT", type: "streaming", note: "B1リーグ全試合を独占配信。月額2,189円（税込）" },
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "一部試合を配信" },
    ],
    tips: "U-NEXTがB1リーグの全試合独占配信権を保有。31日間の無料トライアルあり。",
    keywords: ["bリーグ", "b.league", "バスケ", "宇都宮", "千葉", "琉球", "アルバルク"],
  },

  // ── バスケ 海外 ──
  "nba": {
    title: "NBA", sport: "basketball", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "NBA League Pass（Amazon Prime Video経由）", type: "streaming", note: "全試合視聴。Amazon経由で契約可" },
      { name: "Amazon Prime Video", type: "streaming", note: "プレーオフ〜ファイナル含む主要試合を配信" },
      { name: "WOWOW", type: "streaming", note: "一部試合を配信（NBAファイナルは対象外）" },
      { name: "NBA docomo", type: "streaming", note: "ドコモMAX/ポイ活MAXプランなら追加料金なし" },
    ],
    tips: "NBAファイナルはLeague PassとAmazon Prime Videoのみ対応。全試合はLeague Pass一択。",
    keywords: ["nba", "バスケットボール", "八村", "渡邊", "レイカーズ", "ウォリアーズ", "セルティクス"],
  },

  // ── テニス 国内 ──
  "japanTennis": {
    title: "ジャパンオープン・国内テニス大会", sport: "tennis", region: "domestic", isJapan: true,
    season: "2026年",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "楽天ジャパンオープンなど国内大会を配信" },
      { name: "NHK総合", type: "tv", note: "一部の大会を地上波放送" },
    ],
    tips: "楽天ジャパンオープン（東京）はWOWOWで配信。デビスカップ日本戦はU-NEXTで独占配信。",
    keywords: ["ジャパンオープン", "楽天オープン", "デビスカップ", "国内テニス", "有明"],
  },

  // ── テニス 海外 ──
  "grandslam": {
    title: "グランドスラム4大大会", sport: "tennis", region: "international",
    season: "2026年",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "全豪・全仏・ウィンブルドン・全米を全試合配信。月額2,530円" },
      { name: "NHK", type: "tv", note: "注目カードを深夜に録画放送する場合あり" },
    ],
    tips: "4大大会はWOWOW一択。ATPツアー（グランドスラム以外）はU-NEXTが独占配信（2025〜2029年）。",
    keywords: ["全豪", "全仏", "ウィンブルドン", "全米", "グランドスラム", "テニス", "4大大会", "grand slam", "ローランギャロス"],
  },
  "atpTour": {
    title: "ATPツアー（男子テニス）", sport: "tennis", region: "international",
    season: "2026年",
    services: [
      { name: "U-NEXT", type: "streaming", note: "ATPツアー全大会を独占配信（2025〜2029年契約）。月額2,189円" },
    ],
    tips: "グランドスラム期間はU-NEXT＋WOWOWの両方が必要。デビスカップ・ユナイテッドカップもU-NEXTで配信。",
    keywords: ["atp", "男子テニス", "ツアー", "マスターズ1000", "アルカラス", "ジョコビッチ"],
  },
  "wtaTour": {
    title: "WTAツアー（女子テニス）", sport: "tennis", region: "international",
    season: "2026年",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "グランドスラム・主要大会を配信" },
    ],
    tips: "女子テニスの放映権はWOWOW中心。大坂なおみなど日本人選手の試合は注目度高い。",
    keywords: ["wta", "女子テニス", "大坂なおみ", "サバレンカ"],
  },

  // ── F1（区分なし） ──
  "f1": {
    title: "F1（フォーミュラ1）", sport: "f1", region: null,
    season: "2026年シーズン",
    services: [
      { name: "フジテレビNEXTsmart / FOD F1プラン", type: "streaming", note: "全24戦・全セッション完全生中継。月額3,880円〜" },
      { name: "フジテレビNEXT（CS放送・スカパー！）", type: "tv", note: "全24戦・全セッション生中継。月額1,980円〜" },
      { name: "フジテレビ（地上波）", type: "free", note: "最大5戦程度をダイジェスト放送（生中継ではない）" },
    ],
    tips: "2026年からフジテレビが5年間の独占放映権を取得。DAZNでの配信は2025年で終了。",
    keywords: ["f1", "フォーミュラ", "formula 1", "グランプリ", "モナコgp", "鈴鹿", "角田裕毅"],
  },

  // ── ラグビー 国内 ──
  "leagueOne": {
    title: "ジャパンラグビー リーグワン", sport: "rugby", region: "domestic",
    season: "2025-26シーズン",
    services: [
      { name: "J SPORTSオンデマンド", type: "streaming", note: "ディビジョン1〜3の全試合を配信。「ラグビーパック」あり" },
      { name: "Amazon Prime Video（J SPORTS経由）", type: "streaming", note: "Prime Video経由でJ SPORTSチャンネル加入可" },
    ],
    tips: "J SPORTSオンデマンドがリーグワンの主要配信先。プレーオフ準々決勝〜決勝は特に注目。",
    keywords: ["リーグワン", "league one", "ラグビー", "サンゴリアス", "スピアーズ", "ブレイブルーパス"],
  },

  // ── NFL（海外） ──
  "nfl": {
    title: "NFL（アメリカンフットボール）", sport: "other", region: "international",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "スーパーボウル含む試合を配信" },
      { name: "日テレジータス（CS）", type: "tv", note: "スーパーボウルを生中継" },
    ],
    tips: "スーパーボウル2026はDAZNと日テレジータスで中継。レギュラーシーズンはDAZNで一部配信。",
    keywords: ["nfl", "アメリカンフットボール", "スーパーボウル", "super bowl"],
  },

  // ── ゴルフ 国内 ──
  "golfDomestic": {
    title: "国内ゴルフ（JGTO・JLPGA）", sport: "golf", region: "domestic",
    season: "2026年",
    services: [
      { name: "J SPORTS", type: "streaming", note: "国内男子（JGTO）ツアーを配信" },
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "国内女子（JLPGAツアー）を配信" },
      { name: "NHK BS・地上波各局", type: "tv", note: "主要トーナメントを地上波・BS放送" },
    ],
    tips: "国内男子はJ SPORTS、国内女子はWOWOWが中心。一部試合は地上波でも無料視聴可能。",
    keywords: ["jgto", "jlpga", "国内ゴルフ", "日本ゴルフ", "松山英樹", "渋野日向子", "女子ゴルフ"],
  },

  // ── ゴルフ 海外 ──
  "golfMajor": {
    title: "海外ゴルフ（4大メジャー・PGAツアー）", sport: "golf", region: "international",
    season: "2026年",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "マスターズ・全米オープン・全英・全米プロ選手権など4大メジャーを独占配信" },
      { name: "NHK BS・地上波各局", type: "tv", note: "メジャー大会の一部をBS・地上波放送" },
    ],
    tips: "海外メジャーはWOWOWが最も充実。松山英樹などが出場するマスターズは特に注目。",
    keywords: ["マスターズ", "全米オープン ゴルフ", "全英オープン", "全米プロ", "pga", "海外ゴルフ", "メジャー"],
  },

  // ── その他 ──
  "swimming": {
    title: "競泳・水泳", sport: "other", region: null,
    season: "2026年",
    services: [
      { name: "NHK総合", type: "tv", note: "世界選手権・国内大会などを放送" },
      { name: "NHK+", type: "free", note: "NHK放送分は同時・見逃し配信あり" },
    ],
    tips: "国際大会や国内主要大会はNHKが中心。",
    keywords: ["水泳", "競泳", "swimming", "池江璃花子", "瀬戸大也"],
  },
  "volleyball": {
    title: "バレーボール（Vリーグ・日本代表）", sport: "other", region: "domestic", isJapan: true,
    season: "2025-26シーズン",
    services: [
      { name: "NHK総合", type: "tv", note: "日本代表戦・国際大会などを放送" },
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "Vリーグ・国際大会を一部配信" },
      { name: "TVerなど", type: "free", note: "民放放送分の一部を無料配信" },
    ],
    tips: "日本代表の国際大会はNHKと民放で無料視聴できる場合が多い。Vリーグ全試合はDAZNで配信。",
    keywords: ["バレーボール", "vリーグ", "volleyball", "石川祐希", "バレー日本代表"],
  },
};

// プロリーグフィルター
const SPORTS = [
  { id: "soccer",     label: "サッカー",  icon: "⚽" },
  { id: "baseball",   label: "野球",      icon: "⚾" },
  { id: "basketball", label: "バスケ",    icon: "🏀" },
  { id: "tennis",     label: "テニス",    icon: "🎾" },
  { id: "f1",         label: "F1",        icon: "🏎️" },
  { id: "rugby",      label: "ラグビー",  icon: "🏉" },
  { id: "golf",       label: "ゴルフ",    icon: "⛳" },
  { id: "other",      label: "その他",    icon: "🏆" },
];

// 日本代表フィルター
const JAPAN_SPORTS = [
  { id: "japan_soccer",      label: "サッカー",  icon: "🇯🇵", sport: "soccer" },
  { id: "japan_baseball",    label: "野球",      icon: "🇯🇵", sport: "baseball" },
  { id: "japan_basketball",  label: "バスケ",    icon: "🇯🇵", sport: "basketball" },
  { id: "japan_tennis",      label: "テニス",    icon: "🇯🇵", sport: "tennis" },
  { id: "japan_volleyball",  label: "バレー",    icon: "🇯🇵", sport: "other" },
];

const REGION_LABEL = {
  domestic: { label: "日本国内", bg: "#e8f4ff", color: "#1a6fc4", border: "#b3d4f5" },
  international: { label: "🌍 海外", bg: "#fff0e8", color: "#c45a1a", border: "#f5c8a0" },
};

function searchDB(query, selectedSport, selectedJapanSport) {
  const q = query.toLowerCase().trim();
  return Object.entries(DB)
    .filter(([, item]) => {
      // プロリーグ側のフィルター
      const proMatch = !item.isJapan && (!selectedSport || item.sport === selectedSport);
      // 日本代表側のフィルター
      const japanJs = selectedJapanSport ? JAPAN_SPORTS.find(j => j.id === selectedJapanSport) : null;
      const japanMatch = item.isJapan && (!japanJs || item.sport === japanJs.sport);

      const show = proMatch || japanMatch;
      if (!show) return false;
      if (!q) return true;
      const keywordMatch = item.keywords.some(k => k.includes(q) || q.includes(k));
      const titleMatch = item.title.toLowerCase().includes(q);
      return keywordMatch || titleMatch;
    })
    .map(([key, item]) => ({ key, ...item }));
}

// 国内→海外→区分なし の順でグループ化
function groupResults(items) {
  const domestic = items.filter(i => i.region === "domestic");
  const international = items.filter(i => i.region === "international");
  const none = items.filter(i => !i.region);
  return { domestic, international, none };
}

const TYPE_STYLE = {
  streaming: { bg: "#e8f4ff", border: "#b3d4f5", accent: "#1a6fc4", label: "📱 サブスク" },
  tv:        { bg: "#e8f8f0", border: "#a8dfc0", accent: "#1a8a4a", label: "📺 テレビ" },
  free:      { bg: "#fff8e8", border: "#f5dfa0", accent: "#b07800", label: "🆓 無料" },
};

function SectionHeader({ region }) {
  const r = REGION_LABEL[region];
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "10px",
      margin: "20px 0 10px",
    }}>
      <div style={{
        padding: "4px 14px", borderRadius: "20px",
        background: r.bg, color: r.color,
        border: `1px solid ${r.border}`,
        fontSize: "12px", fontWeight: 800, letterSpacing: "0.5px",
      }}>
        {r.label}
      </div>
      <div style={{ flex: 1, height: "1px", background: r.border }} />
    </div>
  );
}

function Card({ item, expanded, setExpanded }) {
  const isOpen = expanded === item.key;
  return (
    <div style={{
      borderRadius: "14px",
      border: isOpen ? "1px solid #90bce0" : "1px solid #dce8f0",
      background: "#ffffff",
      overflow: "hidden",
      boxShadow: isOpen ? "0 4px 16px rgba(26,111,196,0.12)" : "0 2px 6px rgba(0,0,0,0.06)",
      transition: "all 0.2s",
    }}>
      <button
        onClick={() => setExpanded(isOpen ? null : item.key)}
        style={{
          width: "100%", textAlign: "left", padding: "16px 18px",
          background: "none", border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "15px", fontWeight: 800, color: "#1a2a3a", marginBottom: "4px", lineHeight: 1.3, display: "flex", alignItems: "center", gap: "6px" }}>
            {item.title}
            {item.isJapan && <span style={{ fontSize: "16px" }}>🇯🇵</span>}
          </div>
          <div style={{ fontSize: "11px", color: "#7a90a8" }}>{item.season}</div>
        </div>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
          <div style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "10px",
            background: item.isJapan ? "#fff0e8" : "#e8f4ff",
            color: item.isJapan ? "#c45a1a" : "#1a6fc4", fontWeight: 700,
          }}>
            {item.services.length}サービス
          </div>
          <div style={{
            color: "#90a8c0", fontSize: "12px",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "none",
          }}>▼</div>
        </div>
      </button>

      {isOpen && (
        <div style={{ padding: "0 16px 16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {item.services.map((svc, i) => {
              const s = TYPE_STYLE[svc.type] || TYPE_STYLE.streaming;
              const url = SERVICE_URLS[svc.name];
              return (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: "10px",
                  background: s.bg, border: `1px solid ${s.border}`,
                  display: "flex", gap: "10px", alignItems: "flex-start",
                }}>
                  <div style={{
                    padding: "3px 9px", borderRadius: "6px",
                    background: `${s.accent}18`, color: s.accent,
                    fontSize: "10px", fontWeight: 700,
                    whiteSpace: "nowrap", letterSpacing: "0.5px", marginTop: "2px", flexShrink: 0,
                  }}>
                    {s.label}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "#1a2a3a", lineHeight: 1.3, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      {svc.name}
                      {url && (
                        <a href={url} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          style={{
                            fontSize: "11px", padding: "2px 10px", borderRadius: "6px",
                            background: s.accent, color: "#fff",
                            textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap",
                          }}>
                          サイトへ →
                        </a>
                      )}
                    </div>
                    {svc.note && <div style={{ fontSize: "12px", color: "#5a7a90", marginTop: "4px", lineHeight: 1.5 }}>{svc.note}</div>}
                  </div>
                </div>
              );
            })}
          </div>
          {item.tips && (
            <div style={{
              padding: "10px 14px", borderRadius: "8px",
              background: "#f0f8ff", border: "1px solid #c0daf5",
              fontSize: "12px", color: "#2a5a8a", lineHeight: 1.7,
            }}>
              💡 {item.tips}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [selectedSport, setSelectedSport] = useState(null);     // null=全プロリーグ
  const [selectedJapanSport, setSelectedJapanSport] = useState(null); // null=全日本代表
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);

  const results = useMemo(
    () => searchDB(query, selectedSport, selectedJapanSport),
    [query, selectedSport, selectedJapanSport]
  );

  // プロリーグ結果と日本代表結果を分離
  const proResults = useMemo(() => results.filter(r => !r.isJapan), [results]);
  const japanResults = useMemo(() => results.filter(r => r.isJapan), [results]);

  // プロリーグの国内・海外グループ
  const { domestic, international, none } = useMemo(() => groupResults(proResults), [proResults]);

  const handleSport = (id) => {
    setSelectedSport(prev => prev === id ? null : id);
    setExpanded(null);
  };
  const handleJapanSport = (id) => {
    setSelectedJapanSport(prev => prev === id ? null : id);
    setExpanded(null);
  };

  // プロリーグで特定スポーツ選択時のみ国内・海外ヘッダーを表示
  const showRegionHeaders = !!selectedSport && domestic.length > 0 && international.length > 0;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f0f4f8",
      color: "#1a2a3a",
      fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif",
    }}>
      {/* ヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #1a6fc4 0%, #0d4a8a 100%)",
        padding: "32px 20px 28px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "6px", color: "#a0d0ff", textTransform: "uppercase", marginBottom: "10px", fontWeight: 700 }}>
          DOKOSPO · JAPAN 2026
        </div>
        <h1 style={{ margin: 0, fontSize: "38px", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.1, color: "#fff" }}>
          📺 どこスポ
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: "15px", color: "#7dd3fc", fontWeight: 700 }}>
          スポーツ中継どこで見れる？
        </p>
        <div style={{
          display: "inline-block",
          margin: "12px auto 0",
          padding: "6px 16px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.2)",
          fontSize: "12px",
          color: "#e0f0ff",
          lineHeight: 1.7,
        }}>
          DAZN・Netflix・地上波など、どのサービスで<br />見られるかをまとめた中継先確認サイト
        </div>
        <p style={{ margin: "10px 0 0", fontSize: "11px", color: "#7ab8e8" }}>
          2026年最新情報 · 即時表示 · シーズン毎に更新
        </p>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "20px 14px 60px" }}>

        {/* 検索バー */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
          <input
            type="text" value={query}
            onChange={e => { setQuery(e.target.value); setExpanded(null); }}
            placeholder="リーグ名・大会名・選手名で検索…"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "14px 40px 14px 42px", borderRadius: "12px",
              border: "1px solid #c8d8e8", background: "#ffffff",
              color: "#1a2a3a", fontSize: "15px",
              fontFamily: "inherit", outline: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setExpanded(null); }} style={{
              position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#90a0b0",
              cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "0 4px",
            }}>×</button>
          )}
        </div>

        {/* ── プロリーグ フィルター ── */}
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#1a6fc4", whiteSpace: "nowrap" }}>プロリーグ（国内・海外のリーグ戦/カップ戦）</span>
            <div style={{ flex: 1, height: "1px", background: "#b3d4f5" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingLeft: "4px" }}>
            {SPORTS.map(s => (
              <button key={s.id} onClick={() => handleSport(s.id)} style={{
                padding: "7px 13px", borderRadius: "20px",
                border: selectedSport === s.id ? "1px solid #1a6fc4" : "1px solid #c8d8e8",
                background: selectedSport === s.id ? "#1a6fc4" : "#ffffff",
                color: selectedSport === s.id ? "#ffffff" : "#4a6a8a",
                fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                fontWeight: selectedSport === s.id ? 700 : 400,
                transition: "all 0.15s",
                boxShadow: selectedSport === s.id ? "0 2px 8px rgba(26,111,196,0.3)" : "0 1px 3px rgba(0,0,0,0.06)",
              }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── 日本代表 フィルター ── */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#c45a1a", whiteSpace: "nowrap" }}>🇯🇵 日本代表・W杯・五輪</span>
            <div style={{ flex: 1, height: "1px", background: "#f5c8a0" }} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingLeft: "4px" }}>
            {JAPAN_SPORTS.map(j => (
              <button key={j.id} onClick={() => handleJapanSport(j.id)} style={{
                padding: "6px 12px", borderRadius: "20px",
                border: selectedJapanSport === j.id ? "1px solid #c45a1a" : "1px solid #f5c8a0",
                background: selectedJapanSport === j.id ? "#c45a1a" : "#fff8f4",
                color: selectedJapanSport === j.id ? "#ffffff" : "#c45a1a",
                fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
                fontWeight: selectedJapanSport === j.id ? 700 : 400,
                transition: "all 0.15s",
                boxShadow: selectedJapanSport === j.id ? "0 2px 8px rgba(196,90,26,0.3)" : "0 1px 3px rgba(0,0,0,0.04)",
                display: "flex", alignItems: "center", gap: "6px",
              }}>
                <Hinomaru size={14} />
                {j.label}
              </button>
            ))}
          </div>
        </div>

        {/* 結果なし */}
        {results.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#90a8c0" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📡</div>
            <div style={{ fontSize: "14px", lineHeight: 1.8 }}>
              {query ? `「${query}」に一致する情報が見つかりませんでした。` : "条件に一致する情報がありません。"}<br />
              <span style={{ fontSize: "12px", color: "#b0c8d8" }}>キーワードや絞り込みを変えてお試しください</span>
            </div>
          </div>
        )}

        {/* ── プロリーグ結果 ── */}
        {proResults.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#1a6fc4", whiteSpace: "nowrap" }}>
                プロリーグ（リーグ戦/カップ戦） · {proResults.length}件
              </span>
              <div style={{ flex: 1, height: "1px", background: "#b3d4f5" }} />
            </div>
            {domestic.length > 0 && (
              <>
                {showRegionHeaders && <SectionHeader region="domestic" />}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {domestic.map(item => <Card key={item.key} item={item} expanded={expanded} setExpanded={setExpanded} />)}
                </div>
              </>
            )}
            {international.length > 0 && (
              <>
                {showRegionHeaders && <SectionHeader region="international" />}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {international.map(item => <Card key={item.key} item={item} expanded={expanded} setExpanded={setExpanded} />)}
                </div>
              </>
            )}
            {none.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "8px" }}>
                {none.map(item => <Card key={item.key} item={item} expanded={expanded} setExpanded={setExpanded} />)}
              </div>
            )}
          </div>
        )}

        {/* ── 日本代表結果 ── */}
        {japanResults.length > 0 && (
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#c45a1a", whiteSpace: "nowrap" }}>
                🇯🇵 日本代表・W杯・五輪 · {japanResults.length}件
              </span>
              <div style={{ flex: 1, height: "1px", background: "#f5c8a0" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {japanResults.map(item => <Card key={item.key} item={item} expanded={expanded} setExpanded={setExpanded} />)}
            </div>
          </div>
        )}

        {/* フッター */}
        {results.length > 0 && (
          <div style={{ marginTop: "32px", fontSize: "11px", color: "#90a8c0", textAlign: "center", lineHeight: 1.9 }}>
            ※ 掲載情報は2026年5月時点のものです<br />
            放映権はシーズン毎に変更される場合があります<br />
            最新情報は各サービスの公式サイトでご確認ください
          </div>
        )}
      </div>
    </div>
  );
}
