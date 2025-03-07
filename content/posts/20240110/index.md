---
title: "Next.js+microCMS（複数環境）のapikeyはenv-cmdで管理すると罠にハマる"
date: 2024-01-10
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2024-01-10"
---

- [TL;DR](#tldr)
- [Introduction](#introduction)
- [プロジェクトのmicroCMSの構成](#プロジェクトのmicrocmsの構成)
- [microCMSの複数環境](#microcmsの複数環境)
- [各環境のapikeyの使い分け](#各環境のapikeyの使い分け)
  - [env-cmdを使用](#env-cmdを使用)
    - [弱点：NEXT\_PUBLICがついていようとクライアントサイドから環境変数が参照できない](#弱点next_publicがついていようとクライアントサイドから環境変数が参照できない)
    - [厳密に言えばクライアントサイドから使用できないこともない](#厳密に言えばクライアントサイドから使用できないこともない)
  - [愚直に分ける](#愚直に分ける)
- [別解](#別解)


## TL;DR

env-cmdはNEXT_PUBLICの接頭辞をもつ環境変数もクライアントサイドから読み込むことは不可能なので、他の方法を使用すべし。

## Introduction

microCMSの[複数環境（ステージング環境）](https://microcms.io/features/workflow#:~:text=%E8%BF%BD%E5%8A%A0%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F-,%E8%A4%87%E6%95%B0%E7%92%B0%E5%A2%83%EF%BC%88%E3%82%B9%E3%83%86%E3%83%BC%E3%82%B8%E3%83%B3%E3%82%B0%E7%92%B0%E5%A2%83%EF%BC%89,-%E6%9C%AC%E7%95%AA%E7%92%B0%E5%A2%83%E3%81%AB)の導入により、dev環境とstg環境でCMSの参照先を分けたいというパターンが出てくるようになった。

その時に、apikeyをスマートに管理したい！となったとき、[env-cmd](https://www.npmjs.com/package/env-cmd)の導入を試みたがプロジェクトの環境と噛み合わず苦労した……というお話。

## プロジェクトのmicroCMSの構成

Next.jsを利用した、ハイドレーションありのSSG。build時にmicroCMSのデータをfetchしてjsonとして保持している。CMSの更新をフックしてbuildが実行される。

build時にfetchしているだけなので、そのままやるとmicroCMSの下書きプレビューが確認できない。

そのため、下書き時はAPIからデータをfetchするようにしなければいけない。

```jsx
src/pages
...
├── index.module.scss
├── index.page.tsx
└── preview
   └── index.page.tsx
```

preview用のページを作成して、そちらはページアクセス時に実際にAPIを叩いてデータを取得するようにしている。

それとdraftKeyとの組み合わせでmicroCMSの下書きを取得できるようにした。

## microCMSの複数環境

「本番」「開発」といったブランチ感覚で複数の環境を作れるようになった（ブランチのように派生は可能だが、マージは出来ないのでご注意）

紛らわしくなるので、本記事では呼称は以下に統一する。

|          | 開発用   | 本番公開用 |
| -------- | -------- | ---------- |
| CMS      | CMS_開発 | CMS_本番   |
| ドメイン | DEV環境  | PRD環境    |

microCMSの本番環境を「CMS_本番」、開発環境「CMS_開発」と呼称する。

そうなってくると、DEV環境ではCMS_開発のデータを参照してほしいし、PRD環境ではCMS_本番のデータを参照してほしい。

## 各環境のapikeyの使い分け

### [env-cmd](https://github.com/toddbluhm/env-cmd)を使用

```bash
yarn add -D env-cmd
```

環境によって分けたい環境変数を`.env.dev`や`.env.prod`のようにファイルごと分ける

```bash
...
NEXT_PUBLIC_CMS_API_KEY=... // dev用のkeyを記述
...
```

```bash
"dev:dev": "env-cmd -f .env.dev next dev"
"dev:dev": "env-cmd -f .env.prod next dev"
```

参照する`.env`ファイルがそれぞれ明示できるので、`NEXT_PUBLIC_CMS_API_KEY`のキー名のまま各設定ファイルが参照できてとってもスマート！

#### 弱点：NEXT_PUBLICがついていようとクライアントサイドから環境変数が参照できない

Next.jsは環境変数の接頭辞としてNEXT_PUBLICを追加することで、本来不可能なクライアントサイドからの環境変数の参照を可能にする。

**ただ、env-cmdを使用して読み込んだ環境変数はNEXT_PUBLICを接頭辞に追加しても読み込むことができない。** そのため、今回は下書きプレビュー画面にアクセスると軒並み「APIキーが読み込めないよ！」と怒られる。（開発環境下のみ？buildした資材を確認したところ無事アクセスできたが詳細は不明）

#### 厳密に言えばクライアントサイドから使用できないこともない

[GetEnvVers](https://github.com/toddbluhm/env-cmd?tab=readme-ov-file#getenvvars)関数が提供されているため、それを使用すれば自由に行ける気がするが非同期で処理されるためすでに実装しているものへの影響範囲が大きそうなのでやめた（諦めた）

### 愚直に分ける

```jsx
...
"dev": "NODE_ENV='development' next dev"
...
```

npm scriptのそれぞれに環境を示す環境変数をつける

```jsx
...
NEXT_PUBLIC_DEV_CMS_API_KEY=...
NEXT_PUBLIC_PRD_CMS_API_KEY=...
...
```

.envファイルにそれぞれの環境用のapikeyを用意

```jsx
const ... = process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_DEV_CMS_API_KEY
    : process.env.NEXT_PUBLIC_PRD_CMS_API_KEY;
```

使用する場所でNODE_ENVによって代入する環境変数を変える

## 別解

結局これしかなかった……と思ったが、後日1passとの組み合わせでより強固にできることを発見。別記事にまとめる。
