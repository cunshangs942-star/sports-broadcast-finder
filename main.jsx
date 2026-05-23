import { useState, useMemo } from "react";

// ===== 2026年度 放映先データベース =====
// シーズン更新時はここのデータを編集してください
const DB = {
  "jleague": {
    title: "Jリーグ（J1・J2・J3）", sport: "soccer",
    season: "2026年（百年構想リーグ）",
    services: [
      { name: "DAZN / DMM×DAZNホーダイ", type: "streaming", note: "全試合独占配信。DMM×DAZNホーダイは月額3,480円でお得" },
      { name: "ABEMA", type: "free", note: "毎節1〜2試合を無料配信（事前告知なし・会員登録不要）" },
      { name: "NHK BS / 地方局", type: "tv", note: "一部カードのみ地上波・BS放送あり" },
    ],
    tips: "全試合見たいならDAZNが必須。ABEMAは無料で一部視聴可能だが試合は選べない。",
    keywords: ["jリーグ", "j1", "j2", "j3", "jleague", "百年構想", "明治安田", "ジェイリーグ"],
  },
  "premier": {
    title: "プレミアリーグ", sport: "soccer",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXTサッカーパック", type: "streaming", note: "全試合独占配信。月額2,600円（単体プラン）" },
    ],
    tips: "DAZNは2024-25で配信終了。現在はU-NEXTサッカーパック一択。ラ・リーガも同パックで視聴可能。",
    keywords: ["プレミアリーグ", "premier league", "epl", "イングランド", "プレミア", "マンチェスター", "アーセナル", "リバプール", "三笘"],
  },
  "laliga": {
    title: "ラ・リーガ（スペイン1部）", sport: "soccer",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXTサッカーパック", type: "streaming", note: "全試合独占配信。プレミアリーグと同パック。月額2,600円" },
    ],
    tips: "プレミアリーグと同じU-NEXTサッカーパックで視聴可能。レアルマドリード・バルセロナなど全試合配信。",
    keywords: ["ラ・リーガ", "laliga", "スペイン", "リーガ", "レアルマドリー", "バルセロナ", "久保建英"],
  },
  "bundesliga": {
    title: "ブンデスリーガ（ドイツ1部）", sport: "soccer",
    season: "2025-26シーズン",
    services: [
      { name: "Amazon Prime Video（サッカーLIVEライト）", type: "streaming", note: "ブンデスリーガ全試合視聴可能" },
      { name: "DAZN", type: "streaming", note: "一部試合を配信" },
    ],
    tips: "Amazonプライムビデオの「サッカーLIVEライト」オプションでブンデスリーガ全試合視聴可能。",
    keywords: ["ブンデスリーガ", "bundesliga", "ドイツ", "バイエルン", "ドルトムント"],
  },
  "seriea": {
    title: "セリエA（イタリア1部）", sport: "soccer",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN", type: "streaming", note: "配信中。DMM×DAZNホーダイはお得" },
    ],
    tips: "DAZNで視聴可能。DMM×DAZNホーダイ（月額3,480円）がコスパ良好。",
    keywords: ["セリエa", "serie a", "イタリア", "インテル", "ユベントス", "ミラン", "ナポリ"],
  },
  "ligue1": {
    title: "リーグ・アン（フランス1部）", sport: "soccer",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN", type: "streaming", note: "配信中" },
    ],
    tips: "DAZNで視聴可能。PSGなどが出場する注目試合も配信。",
    keywords: ["リーグアン", "ligue 1", "フランス", "psg", "パリサンジェルマン"],
  },
  "wcup": {
    title: "FIFAワールドカップ2026", sport: "soccer",
    season: "2026年6〜7月",
    services: [
      { name: "DAZN", type: "streaming", note: "全104試合ライブ配信。日本代表戦は全試合無料" },
      { name: "NHK総合", type: "tv", note: "開幕戦・決勝など33試合を地上波生中継" },
      { name: "日本テレビ", type: "tv", note: "日本代表戦1試合含む15試合を地上波中継" },
      { name: "フジテレビ", type: "tv", note: "日本代表戦含む10試合を地上波中継" },
      { name: "NHK BSプレミアム4K", type: "tv", note: "録画含め全104試合をカバー" },
    ],
    tips: "日本代表戦はDAZNで無料視聴可能。地上波でも多数の試合が放送されるため、日本戦は無料で見られる。",
    keywords: ["ワールドカップ", "w杯", "world cup", "wcup", "fifa", "サッカー日本代表"],
  },
  "japan": {
    title: "サッカー日本代表", sport: "soccer",
    season: "2026年",
    services: [
      { name: "DAZN", type: "streaming", note: "W杯・アジア予選など主要試合を配信。日本代表W杯戦は無料" },
      { name: "NHK総合", type: "tv", note: "W杯・一部親善試合を地上波放送" },
      { name: "フジテレビ / 日本テレビ", type: "tv", note: "W杯の一部試合を地上波中継" },
    ],
    tips: "W杯の日本代表戦はDAZNで無料視聴可能。親善試合はNHKや民放でも放送される場合あり。",
    keywords: ["日本代表", "侍ブルー", "サムライブルー", "三笘", "久保", "伊東", "遠藤"],
  },
  "acl": {
    title: "AFCアジアチャンピオンズリーグ", sport: "soccer",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN", type: "streaming", note: "配信中" },
    ],
    tips: "DAZNで視聴可能。Jリーグ勢が出場する試合は注目度が高い。",
    keywords: ["acl", "アジアチャンピオンズ", "afc", "アジア", "チャンピオンズリーグ アジア"],
  },

  // ---- 野球 ----
  "npb": {
    title: "プロ野球（NPB）", sport: "baseball",
    season: "2026年シーズン",
    services: [
      { name: "DAZN", type: "streaming", note: "全試合配信。DAZN BASEBALLプランは月額2,300円" },
      { name: "Hulu", type: "streaming", note: "巨人主催全試合を配信" },
      { name: "スカパー！", type: "streaming", note: "セ・パ各チームのCS専門チャンネルで放送" },
      { name: "NHK BS・地上波各局", type: "tv", note: "注目試合を随時放送。地方局でホームチーム中継あり" },
    ],
    tips: "チームによって配信先が異なる。全チーム見たいならDAZNかスカパーがおすすめ。巨人ファンはHuluも選択肢。",
    keywords: ["プロ野球", "npb", "セリーグ", "パリーグ", "巨人", "阪神", "ソフトバンク", "日本ハム", "ヤクルト", "広島", "中日", "横浜", "楽天", "ロッテ", "西武", "オリックス"],
  },
  "mlb": {
    title: "MLB（米大リーグ）", sport: "baseball",
    season: "2026年シーズン",
    services: [
      { name: "Amazon Prime Video", type: "streaming", note: "開幕戦・侍ジャパン関連など一部試合を配信" },
      { name: "DAZN", type: "streaming", note: "一部試合を配信" },
    ],
    tips: "全試合視聴は「MLB.TV」（公式）の契約が必要な場合あり。大谷・山本など日本人選手の試合は注目度高い。",
    keywords: ["mlb", "メジャーリーグ", "大リーグ", "大谷", "ドジャース", "山本由伸", "今永"],
  },
  "wbc": {
    title: "ワールドベースボールクラシック（WBC）", sport: "baseball",
    season: "2026年大会（3月開催・終了）",
    services: [
      { name: "Netflix", type: "streaming", note: "日本国内独占配信。地上波・他サービスでの放送一切なし" },
    ],
    tips: "2026年WBCはNetflix完全独占。地上波・BS・CS含め他チャンネルでの中継はなかった。",
    keywords: ["wbc", "ワールドベースボール", "侍ジャパン", "野球 世界大会"],
  },

  // ---- バスケ ----
  "bLeague": {
    title: "Bリーグ（B1・B2）", sport: "basketball",
    season: "2025-26シーズン",
    services: [
      { name: "U-NEXT", type: "streaming", note: "B1リーグ全試合を独占配信。月額2,189円（税込）" },
      { name: "DAZN", type: "streaming", note: "一部試合を配信" },
    ],
    tips: "U-NEXTがB1リーグの全試合独占配信権を保有。31日間の無料トライアルあり。",
    keywords: ["bリーグ", "b.league", "バスケ", "宇都宮", "千葉", "琉球", "アルバルク"],
  },
  "nba": {
    title: "NBA", sport: "basketball",
    season: "2025-26シーズン",
    services: [
      { name: "NBA League Pass（Amazon Prime Video経由）", type: "streaming", note: "全試合視聴。Amazon経由で契約可" },
      { name: "Amazon Prime Video", type: "streaming", note: "プレーオフ〜ファイナル含む主要試合を配信" },
      { name: "WOWOW", type: "streaming", note: "一部試合を配信（NBAファイナルは対象外）" },
      { name: "NBA docomo", type: "streaming", note: "ドコモMAX/ポイ活MAXプランなら追加料金なし" },
    ],
    tips: "NBAファイナルはLeague PassとAmazon Prime Videoのみ対応。全試合はLeague Pass一択。八村塁など日本人選手の試合に注目。",
    keywords: ["nba", "バスケットボール", "八村", "渡邊", "レイカーズ", "ウォリアーズ", "セルティクス"],
  },

  // ---- テニス ----
  "grandslam": {
    title: "テニス グランドスラム4大大会", sport: "tennis",
    season: "2026年",
    services: [
      { name: "WOWOW / WOWOWオンデマンド", type: "streaming", note: "全豪・全仏・ウィンブルドン・全米を全試合配信。月額2,530円" },
      { name: "NHK", type: "tv", note: "注目カードを深夜に録画放送する場合あり" },
    ],
    tips: "4大大会はWOWOW一択。ATPツアー（グランドスラム以外の男子ツアー）はU-NEXTが独占配信（2025〜2029年）。",
    keywords: ["全豪", "全仏", "ウィンブルドン", "全米", "グランドスラム", "テニス", "4大大会", "grand slam", "ローランギャロス"],
  },
  "atpTour": {
    title: "ATPツアー（男子テニス）", sport: "tennis",
    season: "2026年",
    services: [
      { name: "U-NEXT", type: "streaming", note: "ATPツアー全大会を独占配信（2025〜2029年契約）。月額2,189円" },
    ],
    tips: "グランドスラム期間はU-NEXT＋WOWOWの両方が必要。デビスカップ・ユナイテッドカップもU-NEXTで配信。",
    keywords: ["atp", "男子テニス", "ツアー", "マスターズ1000", "インディアンウェルズ", "マイアミ", "ロジャーフェデラー", "ジョコビッチ", "アルカラス"],
  },
  "wtaTour": {
    title: "WTAツアー（女子テニス）", sport: "tennis",
    season: "2026年",
    services: [
      { name: "WOWOW", type: "streaming", note: "グランドスラム・主要大会を配信" },
    ],
    tips: "女子テニスの放映権はWOWOW中心。大坂なおみなど日本人選手の試合は注目度高い。",
    keywords: ["wta", "女子テニス", "大坂なおみ", "サバレンカ", "スビテク"],
  },

  // ---- F1 ----
  "f1": {
    title: "F1（フォーミュラ1）", sport: "f1",
    season: "2026年シーズン",
    services: [
      { name: "フジテレビNEXTsmart / FOD F1プラン", type: "streaming", note: "全24戦・全セッション完全生中継。月額3,880円〜（プランにより異なる）" },
      { name: "フジテレビNEXT（CS放送・スカパー！）", type: "tv", note: "全24戦・全セッション生中継。月額1,980円〜" },
      { name: "フジテレビ（地上波）", type: "free", note: "最大5戦程度をダイジェスト放送（生中継ではない）" },
    ],
    tips: "2026年からフジテレビが5年間の独占放映権を取得。DAZNでの配信は2025年で終了。F1 TV（公式）も一部プランで解禁。",
    keywords: ["f1", "フォーミュラ", "formula 1", "グランプリ", "モナコgp", "鈴鹿", "角田裕毅"],
  },

  // ---- ラグビー ----
  "leagueOne": {
    title: "ジャパンラグビー リーグワン", sport: "rugby",
    season: "2025-26シーズン",
    services: [
      { name: "J SPORTSオンデマンド", type: "streaming", note: "ディビジョン1〜3の全試合を配信。「ラグビーパック」あり" },
      { name: "Amazon Prime Video（J SPORTS経由）", type: "streaming", note: "Prime Video経由でJ SPORTSチャンネル加入可" },
    ],
    tips: "J SPORTSオンデマンドがリーグワンの主要配信先。プレーオフ準々決勝〜決勝は特に注目。",
    keywords: ["リーグワン", "league one", "ラグビー", "サンゴリアス", "スピアーズ", "ブレイブルーパス", "ブラックラムズ"],
  },

  // ---- NFL ----
  "nfl": {
    title: "NFL（アメリカンフットボール）", sport: "other",
    season: "2025-26シーズン",
    services: [
      { name: "DAZN", type: "streaming", note: "スーパーボウル含む試合を配信" },
      { name: "日テレジータス（CS）", type: "tv", note: "スーパーボウルを生中継" },
    ],
    tips: "スーパーボウル2026はDAZNと日テレジータスで中継。レギュラーシーズンはDAZNで一部配信。",
    keywords: ["nfl", "アメリカンフットボール", "スーパーボウル", "super bowl"],
  },

  // ---- ゴルフ ----
  "golf": {
    title: "ゴルフ（国内外メジャー・ツアー）", sport: "golf",
    season: "2026年",
    services: [
      { name: "WOWOW", type: "streaming", note: "マスターズ・全米オープン・全英オープン・全米プロ選手権など4大メジャーを独占配信" },
      { name: "WOWOW", type: "streaming", note: "国内女子（JLPGAツアー）・海外女子メジャーも配信" },
      { name: "NHK BS", type: "tv", note: "メジャー大会の一部をBS放送" },
      { name: "J SPORTS", type: "streaming", note: "国内男子（JGTO）ツアーを配信" },
    ],
    tips: "ゴルフのメジャー大会はWOWOWが充実。松山英樹など日本人選手の試合に注目。国内男子はJ SPORTSでも視聴可能。",
    keywords: ["ゴルフ", "golf", "マスターズ", "全米オープン", "全英オープン", "全米プロ", "松山英樹", "jlpga", "jgto"],
  },

  // ---- 水泳・陸上 ----
  "swimming": {
    title: "競泳・水泳", sport: "other",
    season: "2026年",
    services: [
      { name: "NHK総合 / NHK BS", type: "tv", note: "世界選手権・国内大会などを放送" },
      { name: "NHK+", type: "free", note: "NHK放送分は同時・見逃し配信あり" },
    ],
    tips: "国際大会や国内主要大会はNHKが中心。パリ五輪関連はNHKが独占放送していた。",
    keywords: ["水泳", "競泳", "swimming", "池江璃花子", "瀬戸大也"],
  },

  // ---- バレーボール ----
  "volleyball": {
    title: "バレーボール（Vリーグ・日本代表）", sport: "other",
    season: "2025-26シーズン",
    services: [
      { name: "NHK総合 / NHK BS", type: "tv", note: "日本代表戦・国際大会などを放送" },
      { name: "DAZN", type: "streaming", note: "Vリーグ・国際大会を一部配信" },
      { name: "TVerなど", type: "free", note: "民放放送分の一部を無料配信" },
    ],
    tips: "日本代表の国際大会はNHKと民放で無料視聴できる場合が多い。Vリーグ全試合はDAZNで配信。",
    keywords: ["バレーボール", "vリーグ", "volleyball", "石川祐希", "バレー日本代表"],
  },
};

const SPORTS = [
  { id: "all",        label: "すべて",   icon: "🔍" },
  { id: "soccer",     label: "サッカー",  icon: "⚽" },
  { id: "baseball",   label: "野球",     icon: "⚾" },
  { id: "basketball", label: "バスケ",   icon: "🏀" },
  { id: "tennis",     label: "テニス",   icon: "🎾" },
  { id: "f1",         label: "F1",       icon: "🏎️" },
  { id: "rugby",      label: "ラグビー",  icon: "🏉" },
  { id: "golf",       label: "ゴルフ",   icon: "⛳" },
  { id: "other",      label: "その他",   icon: "🏆" },
];

function searchDB(query, sport) {
  const q = query.toLowerCase().trim();
  return Object.entries(DB)
    .filter(([, item]) => {
      const sportMatch = !sport || sport === "all" || item.sport === sport;
      if (!q) return sportMatch;
      const keywordMatch = item.keywords.some(k => k.includes(q) || q.includes(k));
      const titleMatch = item.title.toLowerCase().includes(q);
      return sportMatch && (keywordMatch || titleMatch);
    })
    .map(([key, item]) => ({ key, ...item }));
}

const TYPE_STYLE = {
  streaming: { bg: "#0d1b2a", border: "#1e4d8c", accent: "#4da6ff", label: "📱 サブスク" },
  tv:        { bg: "#0d1f1a", border: "#1e6b4a", accent: "#3dd68c", label: "📺 テレビ" },
  free:      { bg: "#1f1a0d", border: "#6b5a1e", accent: "#f0c040", label: "🆓 無料" },
};

export default function App() {
  const [selectedSport, setSelectedSport] = useState("all");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(null);

  const results = useMemo(() => searchDB(query, selectedSport), [query, selectedSport]);

  const handleSport = (id) => { setSelectedSport(id); setExpanded(null); };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c12",
      color: "#dde4f0",
      fontFamily: "'Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif",
    }}>
      {/* ── ヘッダー ── */}
      <div style={{
        background: "linear-gradient(180deg,#0e1929 0%,#080c12 100%)",
        borderBottom: "1px solid #1a2540",
        padding: "32px 20px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "10px", letterSpacing: "8px", color: "#4da6ff", textTransform: "uppercase", marginBottom: "10px", fontWeight: 700 }}>
          SPORTS ON AIR · JAPAN 2026
        </div>
        <h1 style={{ margin: 0, fontSize: "26px", fontWeight: 900, letterSpacing: "-1px", lineHeight: 1.2 }}>
          スポーツ中継<br />
          <span style={{ color: "#4da6ff" }}>どこで見れる？</span>
        </h1>
        <p style={{ margin: "12px 0 0", fontSize: "13px", color: "#6070a0", lineHeight: 1.6 }}>
          2026年シーズン最新の放映・配信先データベース<br />
          <span style={{ fontSize: "11px", color: "#404870" }}>即時表示 · シーズン毎に更新</span>
        </p>
      </div>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "20px 14px 60px" }}>

        {/* ── 検索バー ── */}
        <div style={{ position: "relative", marginBottom: "14px" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", pointerEvents: "none" }}>🔍</span>
          <input
            type="text" value={query}
            onChange={e => { setQuery(e.target.value); setExpanded(null); }}
            placeholder="リーグ名・大会名・選手名で検索…"
            style={{
              width: "100%", boxSizing: "border-box",
              padding: "14px 40px 14px 42px",
              borderRadius: "12px",
              border: "1px solid #1a2540",
              background: "#0d1420",
              color: "#dde4f0", fontSize: "15px",
              fontFamily: "inherit", outline: "none",
              WebkitAppearance: "none",
            }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setExpanded(null); }} style={{
              position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", color: "#4060a0",
              cursor: "pointer", fontSize: "20px", lineHeight: 1, padding: "0 4px",
            }}>×</button>
          )}
        </div>

        {/* ── スポーツフィルター ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "24px" }}>
          {SPORTS.map(s => (
            <button key={s.id} onClick={() => handleSport(s.id)} style={{
              padding: "7px 13px", borderRadius: "20px",
              border: selectedSport === s.id ? "1px solid #4da6ff" : "1px solid #1a2540",
              background: selectedSport === s.id ? "rgba(77,166,255,0.12)" : "#0d1420",
              color: selectedSport === s.id ? "#4da6ff" : "#6070a0",
              fontSize: "12px", cursor: "pointer", fontFamily: "inherit",
              fontWeight: selectedSport === s.id ? 700 : 400,
              transition: "all 0.15s",
            }}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* ── 件数 ── */}
        <div style={{ fontSize: "11px", color: "#404870", marginBottom: "10px", letterSpacing: "0.5px" }}>
          {results.length > 0
            ? `${results.length}件のリーグ・大会が見つかりました`
            : query ? "" : `全${Object.keys(DB).length}件収録`}
        </div>

        {/* ── 結果なし ── */}
        {results.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#304060" }}>
            <div style={{ fontSize: "52px", marginBottom: "16px" }}>📡</div>
            <div style={{ fontSize: "14px", lineHeight: 1.8 }}>
              「{query}」に一致する情報が見つかりませんでした。<br />
              <span style={{ fontSize: "12px", color: "#283050" }}>キーワードを変えてお試しください</span>
            </div>
          </div>
        )}

        {/* ── カードリスト ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {results.map(item => {
            const isOpen = expanded === item.key;
            return (
              <div key={item.key} style={{
                borderRadius: "14px",
                border: isOpen ? "1px solid #1e3a6a" : "1px solid #141e30",
                background: isOpen ? "#0d1929" : "#0a1018",
                overflow: "hidden",
                transition: "border-color 0.2s, background 0.2s",
              }}>
                {/* カードヘッダー（タップで開閉） */}
                <button
                  onClick={() => setExpanded(isOpen ? null : item.key)}
                  style={{
                    width: "100%", textAlign: "left", padding: "16px 18px",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "15px", fontWeight: 800, color: "#dde4f0", marginBottom: "4px", lineHeight: 1.3 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: "11px", color: "#405080" }}>{item.season}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", alignItems: "center", flexShrink: 0 }}>
                    <div style={{
                      fontSize: "11px", padding: "3px 10px", borderRadius: "10px",
                      background: "rgba(77,166,255,0.1)", color: "#4da6ff", fontWeight: 700,
                    }}>
                      {item.services.length}サービス
                    </div>
                    <div style={{
                      color: "#304060", fontSize: "12px",
                      transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "none",
                    }}>▼</div>
                  </div>
                </button>

                {/* 展開コンテンツ */}
                {isOpen && (
                  <div style={{ padding: "0 16px 16px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                      {item.services.map((svc, i) => {
                        const s = TYPE_STYLE[svc.type] || TYPE_STYLE.streaming;
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
                              whiteSpace: "nowrap", letterSpacing: "0.5px", marginTop: "2px",
                              flexShrink: 0,
                            }}>
                              {s.label}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: "14px", color: "#c8d8f0", lineHeight: 1.3 }}>{svc.name}</div>
                              {svc.note && <div style={{ fontSize: "12px", color: "#506080", marginTop: "4px", lineHeight: 1.5 }}>{svc.note}</div>}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {item.tips && (
                      <div style={{
                        padding: "10px 14px", borderRadius: "8px",
                        background: "rgba(77,166,255,0.05)",
                        border: "1px solid rgba(77,166,255,0.1)",
                        fontSize: "12px", color: "#6080b0", lineHeight: 1.7,
                      }}>
                        💡 {item.tips}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* ── フッター ── */}
        {results.length > 0 && (
          <div style={{ marginTop: "32px", fontSize: "11px", color: "#283050", textAlign: "center", lineHeight: 1.9 }}>
            ※ 掲載情報は2026年5月時点のものです<br />
            放映権はシーズン毎に変更される場合があります<br />
            最新情報は各サービスの公式サイトでご確認ください
          </div>
        )}
      </div>
    </div>
  );
}
