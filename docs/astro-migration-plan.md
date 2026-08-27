# Gatsby 3 → Astro 移行計画

公開サイト: https://shigi-blog.netlify.app/  
リポジトリ: https://github.com/Shigi-p/gatsby-blog

## 決めたこと

1. スタイルは自前 CSS。記法は **SCSS**（インデント構文の Sass ではない）
2. 見た目はライトのみ。色や余白は CSS 変数に出し、ダークは後から `[data-theme="dark"]` を足せるようにする
3. アクセス解析は入れない（GA4 も不要。個人日記の閲覧数を追う理由が薄い。旧 UA はすでに死んでいる）
4. 日本語 URL はやめる。日付スラッグ + 連番にする
5. 新 URL は **`/YYYY-MM-DD-NN`**（同じ日の 1 本目は `-01`。同じ日に増やしても既存 URL を変えなくてよい）

旧 URL からは 301 で新 URL へ飛ばす。本文の `date` を日付の正とする（例: フォルダ名が `20241007` でも frontmatter が `2024-07-26` なら `/2024-07-26-01`）。

## この PR で入れた範囲

記事が新 URL で読め、トップ / Blog / About が開き、旧 URL からリダイレクトされるところまで。

まだ入れてないもの: タグページ、RSS、sitemap、WeeklyMemo の HTML `<img>` の整理、デザインの作り込み、React island。

---

## 1. なぜ今の構成だとデザインを変えにくいか

いまのサイトは、自分で UI を組んでいるのではなく、`@lekoarts/gatsby-theme-minimal-blog` という **Gatsby テーマ** に乗っています。

実際にこのリポジトリが持っているフロントのカスタムは、ほぼ次だけです。

- `gatsby-config.js` のサイト名・ナビ
- `src/@lekoarts/gatsby-theme-minimal-blog/texts/hero.mdx`（トップの紹介文）
- `content/` の記事と About

見た目・レイアウト・コードハイライト・タグページはすべてテーマ内部（`node_modules`）です。テーマは Theme UI（Emotion ベース）なので、「この余白を変えたい」と思っても次のような経路になります。

1. テーマがどのコンポーネントを描いているかを探す
2. Gatsby の **shadowing**（同じパスでファイルを上書きする仕組み）でコピーする
3. Theme UI の `sx` / theme トークンを理解して書き換える

React + TypeScript に慣れていても、触る対象が「自分のコンポーネント」ではなく「他人のテーマの上書き」なので、変更コストが記事を書くことより大きくなります。Gatsby 3 自体も現行の Gatsby 5 系から大きく離れており、テーマを最新に上げるだけでも別作業です。

移行の目的は「見た目を今と完全に同じにすること」ではなく、**記事を残したまま、自分の React / TypeScript / CSS でデザインを変えられる土台にすること**です。

---

## 2. Astro を選ぶ理由（このブログに照らして）

候補として Next.js もありますが、このサイトの実態は次のとおりです。

- 記事は Markdown / MDX の静的ファイル
- コメント欄・検索・会員機能などのサーバー処理はない
- デプロイ先は Netlify の静的ホスティング
- インタラクティブな React コンポーネントは記事中にほぼ無い（`.mdx` でも JSX コンポーネントは使っていない）

この条件では Astro の方が目的に直結します。

| 観点 | Gatsby 3（現状） | Astro |
| --- | --- | --- |
| 記事の読み方 | GraphQL でノードを取る | Content Collections でファイルを型付きで読む |
| UI の所在 | テーマの中 | `src/` に自分で置く |
| React | ページ全体が React | 必要な島（island）だけ React |
| スタイル | Theme UI + shadowing | `.astro` の scoped CSS、CSS Modules、Tailwind など好きなものを直接使える |
| TypeScript | プロジェクトに未導入 | 標準で使える |
| 出力 | 静的 HTML | 静的 HTML（Netlify と相性が良い） |

React を捨てる必要はありません。ヘッダーやダークモード切替など、状態が必要な箇所だけ `.tsx` にすればよく、記事本文は Markdown のままです。

---

## 3. 残すもの / 作り直すもの / 捨ててよいもの

### 残す（コンテンツと公開契約）

- `content/posts/` の本文・画像・frontmatter
- `content/pages/about/index.mdx`
- トップの紹介文（`hero.mdx` の内容）
- 記事本文・画像・frontmatter。公開 URL は `/YYYY-MM-DD-NN` に揃え、旧 URL は 301 する
- サイト名 `Shigi blog`、説明「日記です。」、言語 `jp`
- Netlify への静的デプロイ
- RSS（`/rss.xml`）と sitemap、favicon 類

### 作り直す（コード）

- レイアウト、記事一覧、記事ページ、タグ、About
- Markdown の描画（見出し、コードブロック、画像、引用、表）
- RSS / sitemap の生成
- Netlify 設定（ビルドコマンドが `gatsby build` から変わる）

### 捨ててよい

- Gatsby、テーマ、GraphQL、Theme UI、shadowing
- アクセス解析（GA4 も含め、個人日記では必須ではない）
- `gatsby-plugin-google-analytics`（Universal Analytics。すでに計測できない）
- `gatsby-plugin-offline` / PWA manifest（個人ブログでは必須ではない。必要なら後で足す）
- テーマ同梱のまま残っている LekoArts 由来の文言
  - RSS のタイトルがまだ `Minimal Blog - @lekoarts/...`
  - `static/robots.txt` の sitemap が `minimal-blog.lekoarts.de`
  - `.github/FUNDING.yml` が LekoArts のスポンサー情報

バナー画像 `book_nikkichou_diary.png` は全記事で同じファイルを指しています。移行後は frontmatter から外してデフォルト画像にするか、一覧では使わない、のどちらかで十分です。

---

## 4. 現状の棚卸し

| 項目 | 数・内容 |
| --- | --- |
| 記事 | 42（`.md` が大半、初期 4 本が `.mdx`） |
| 固定ページ | About のみ |
| タグ | `技術` 42、`WeeklyMemo` 12、`日記` 1 |
| 記事画像 | 各記事フォルダの `images/`、`content/posts/img/`、`content/posts/assets/` |
| カスタム UI | hero テキスト以外ほぼなし |
| Node | `.nvmrc` は 18.17.1 |

記事ファイルの置き方が混在しています。中身はそのまま使え、Astro 側で「どこを記事とみなすか」を合わせます。

- `content/posts/20241105/index.md`（フォルダ + 画像）
- `content/posts/20231114.md`（単体ファイル）
- `content/posts/20210716.mdx`（初期の MDX）
- 同じ日付が 2 本: `20230605/index.md` と `20230605.md`

Markdown 上の注意点:

- コードフェンスに ` ```html:index.html ` のようにファイル名を付けている箇所がある（Gatsby テーマの Prism 記法）
- `20240725` は Markdown の中にさらに Markdown フェンスがあり、パーサによっては壊れやすい
- WeeklyMemo 系は `<img src="..." style="zoom:50%;" />` という HTML 直書きがある
- About と初期記事は MDX だが、React コンポーネントの import は無い

---

## 5. URL をそのままにする（最重要）

Gatsby テーマは **slug があればそれを使い、無ければタイトルから kebab-case を生成**します。そのため、ファイル名と公開 URL が一致していません。Astro のファイル名ルーティングに任せると URL が変わり、既存リンクが切れます。

方針: **全記事の frontmatter に、いまの公開 URL と同じ `slug` を明示する。** Astro の動的ルートは `slug` だけを見る。

### 明示 slug がある記事（2023-06 以降の多く）

例: `/2024-11-05`、`/2023-06-05_01`、`/2023-06-05_02`

`20241007/index.md` は本文の `date` が `2024-07-26` なのに slug は `/2024-10-07` です。日付ではなく **いまの URL を正** とします。

### slug が無く、タイトルから作られている記事

| ファイル | 公開 URL |
| --- | --- |
| `20220117.md` | `/0117-weekly-memo` |
| `20220110.md` | `/0110-weekly-memo` |
| `20220103.md` | `/0103-weekly-memo` |
| `20211227.md` | `/1227-weekly-memo` |
| `20211220.md` | `/1220-weekly-memo` |
| `20211213.md` | `/1213-weekly-memo` |
| `20211122.md` | `/1122-weekly-memo` |
| `20211115.md` | `/1115-weekly-memo` |
| `20211108.md` | `/1108-weekly-memo` |
| `20211101.md` | `/1101-weekly-memo` |
| `20211025.md` | `/1025-weekly-memo` |
| `20211018.md` | `/1018-weekly-memo` |
| `20210716.mdx` | `/safariのtransitionと戦う` |
| `20210714.mdx` | `/input-type-date-を徹底解剖する` |
| `20210630.mdx` | `/tsにて-string型の-arrayをリテラル型にするヤツが謎だった` |
| `20210629.mdx` | `/mac-m-1-で-gatsbyを試そうと思ったら-個人的に-ちょっと苦労した` |

出典: 現行サイトの sitemap `https://shigi-blog.netlify.app/sitemap/sitemap-0.xml`

### サイト共通パス

| 現行 | 移行後 |
| --- | --- |
| `/` | 同じ（最新記事 + 紹介文） |
| `/blog` | 同じ |
| `/about` | 同じ |
| `/tags` | 同じ |
| `/tags/技術` | 同じ |
| `/tags/日記` | 同じ |
| `/tags/weekly-memo` | 同じ（タグ名は `WeeklyMemo`、URL だけ kebab） |
| `/rss.xml` | 同じパスで出す |
| `/sitemap/sitemap-index.xml` | Gatsby 特有のパス。Astro 標準は `/sitemap-index.xml`。旧 URL からリダイレクトを置く |

記事 URL はルート直下（`/blog/slug` ではない）です。これは維持します。

---

## 6. 推奨する Astro の形

中身は自分のコードになるので、最初から「テーマをまた使う」のではなく、薄い自前構成にします。

```text
src/
  content.config.ts          # posts / pages のスキーマ（TypeScript）
  layouts/BaseLayout.astro   # ヘッダー・フッター・meta
  components/                # 必要なものだけ。React は island に限定
  pages/
    index.astro              # トップ
    blog.astro               # または blog/index.astro
    about.astro
    tags/index.astro
    tags/[tag].astro
    [...slug].astro          # 記事（ルート直下の URL を維持）
    rss.xml.ts               # RSS
  styles/global.css          # タイポグラフィ・色の変数
content/                     # 現行の記事をほぼそのまま置く
public/                      # 現行 static/ の favicon など
```

記事の置き場は `content/posts` を維持します。本文を `src/content/` へコピーすると差分が見づらく、画像パスも壊れやすいためです。

Content Collections のスキーマで frontmatter を型にします。

- 必須: `title`, `date`, `slug`
- 任意: `tags`（デフォルト `[]`）、`banner`、`description`

`slug` を必須にすると、URL の取りこぼしにビルドで気づけます。

React を使う箇所の目安:

- 使わなくてよい: 記事本文、一覧、About（静的）
- 使ってもよい: ダークモード、将来の検索 UI
- 使わない: 記事 MDX 内の独自コンポーネント（いま存在しない）

---

## 7. スタイルの方針

「今の LekoArts 見た目をピクセル単位で再現する」のは、Theme UI を追う作業になり、移行のメリットを消します。

提案は **タイポグラフィ中心のシンプルな土台を先に作り、その後好きに変える** ことです。現行テーマも本質は「文字が読みやすい日記」なので、最初から同じ系統にしておけば違和感は小さくできます。

選択肢:

1. **`.astro` の scoped CSS + CSS 変数（推奨）**  
   コンポーネントとスタイルが同じファイルにあり、変更箇所が追いやすい。ダークモードは `--bg` / `--text` を切り替えるだけにできる。React + CSS の延長で読める。
2. **Tailwind CSS**  
   慣れていれば速い。ユーティリティが増えると「デザインの意図」がクラス列に散る。仕事で使っているならこちらでもよい。
3. **CSS Modules + React**  
   ページまで全部 React にすると Astro の旨みが減る。コンポーネント単位の見た目にだけ使う。

移行の第一目標は「記事が同じ URL で読めること」です。見た目の作り込みは、土台が動いてから別ステップにします。

フォントは現行が IBM Plex Sans です。続けるかは自由です。日本語本文なら後から Noto Sans JP 等へ変えやすいよう、フォントは CSS 変数 1 箇所にまとめます。

---

## 8. Markdown / 画像で必要な処理

Astro の Markdown（Shiki によるハイライト）で、現行記事の大半はそのまま描画できます。追加で見る点だけ先に決めます。

1. **画像**  
   相対パス `./images/foo.png` は、記事ファイルを Content Collection として読めば Astro が解決できます。HTML の `<img src="./assets/...">` は Markdown の画像記法と扱いが違うので、必要ならパスを直すか、`public/` 配下へ寄せます。
2. **コードフェンスの `lang:filename`**  
   Astro / Shiki は ` ```html title="index.html" ` 形式が一般的です。件数が少ないので、移行時に記法を揃えるか、remark プラグインで変換します。
3. **ネストしたコードブロック（scaffdog の記事）**  
   フェンスの長さを変える（````）など、Markdown として合法な形に直すのが確実です。
4. **見出しアンカー**  
   現行記事は手書き目次で GitHub 風のアンカーを張っています。rehype-slug 相当を有効にし、日本語見出しの ID 規則が今と同じか、移行後に数本スポットチェックします。
5. **MDX**  
   JSX を使っていないので、`.mdx` を `.md` にリネームしても内容は同じです。拡張子を残してもよいです。無理に統一しなくて構いません。

---

## 9. ホスティング・周辺

- ビルド: `astro build` → `dist/`
- Netlify: いまの Gatsby プラグインは不要。`netlify.toml` で publish ディレクトリを `dist` にする
- 環境変数: `GOOGLE_ANALYTICS_ID` は UA 用。残すなら GA4 か、Plausible / Umami など軽量なものへ変更する。計測しない選択も妥当
- `siteLanguage: jp` は HTML 的には `ja` が正しい。`<html lang="ja">` にする。URL や記事には影響しない
- Node は Astro 現行が要求する LTS（20 または 22）へ上げる

Gatsby を残したまま隣に Astro を置く「モノレポ化」は、この規模では過剰です。**ブランチで Astro に置き換え、Netlify のプレビューで確認してから master に入れる**方が単純です。切り戻しは Git で Gatsby 側に戻せます。

---

## 10. 実装ステップ（指示後にこの順で小さく進める）

各ステップは独立して確認できるようにします。一気にテーマ相当の完成品は作りません。

1. **Astro + TypeScript の空プロジェクトをこのリポジトリに置き換える**  
   `package.json` を Astro 用にし、`src/pages/index.astro` がローカルで開くことだけを確認する。Gatsby 依存を外す。
2. **Content Collections で記事を読む**  
   `content/posts` を接続し、ビルドで 42 本拾えることを確認する。この時点で欠けている `slug` を frontmatter に足す。
3. **記事ページを `[...slug].astro` で出す**  
   sitemap の URL と 1 対 1 になることを、パス一覧の突き合わせで確認する。
4. **トップ・`/blog`・About**  
   ナビを現行どおり Blog / About にする。hero 文を移植する。
5. **タグ一覧とタグページ**  
   `/tags/weekly-memo` のように、表示名と URL を分けて実装する。
6. **画像とコードブロック**  
   画像付きの記事（例: `20210714`, `20230605`, WeeklyMemo）を数本見て、欠けとハイライトを直す。
7. **RSS・sitemap・favicon・robots**  
   `/rss.xml` を維持。sitemap の旧パスへリダイレクト。robots の誤った外部 URL を直す。
8. **Netlify 設定とプレビュー**  
   プレビュー URL で sitemap 全パスが 200 になることを確認してから本番を切り替える。

デザインの本格変更（色、レイアウト、フォント）は 8 のあとが安全です。先に見た目を作り込むと、URL や Markdown の不具合に気づきにくくなります。

---

## 11. 移行後に手で確認すること

- sitemap に載っている全 URL がプレビューで 200 であること（リダイレクトも可）
- `/2023-06-05_01` と `/2023-06-05_02` が別記事であること
- 日本語 URL の 4 本が文字化けせず開けること
- `/tags/技術` が 42 件であること
- 記事内画像（相対パスと `<img>`）が欠けないこと
- コードブロックが崩れないこと（特に `20240725` と ` ```html:index.html `）
- RSS の各 `link` が現行と同じパスであること
- トップの紹介文、About、フッター年表示

ブラウザが使える環境では、トップ → 記事 → タグ → About を実際にクリックして確認します。

---

## 12. 判断が分かれる点（実装前に決めておくとよいこと）

実装に入る前に、次だけ方針が決まっていると手戻りが減ります。決まっていなければ、括弧内を仮のデフォルトにします。

1. 見た目は「現行に寄せたシンプルな自前 CSS」でよいか、それとも Tailwind にしたいか（デフォルト: 自前 CSS）
2. ダークモードは最初から入れるか（デフォルト: 最初はライトのみ。変数だけ用意）
3. アクセス解析は捨てるか、GA4 / 他サービスにするか（デフォルト: 外す）
4. 記事 URL は現行維持でよいか。日本語 URL を日付スラッグへ正規化するか（デフォルト: **現行維持**。変えるなら 301 が必須）
5. 新しい記事の URL 規則。今後は `/YYYY-MM-DD` に統一するのが扱いやすい

---

## 13. 次のアクション

この計画に大きな異論がなければ、ステップ 1（Astro の空プロジェクト化）から実装できます。「実装してください」と、必要なら上記 12 の希望を添えて指定してください。
