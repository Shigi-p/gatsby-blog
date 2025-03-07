---
title: "Safariは電話番号を自動的にリンクにするため、Next.jsのSSGではhydration errorを引き起こす  "
date: 2024-01-13
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2024-01-13"
---

- [TL;DR](#tldr)
- [Introduction](#introduction)
- [Next.jsのHydration](#nextjsのhydration)
- [iOS Safariの電話番号の扱い](#ios-safariの電話番号の扱い)

## TL;DR

```bash
<meta name="format-detection" content="telephone=no">
```

を追加しておけばOK

## Introduction

別段おかしなことをしていないのにhydrationエラーが引き起こされ、苦しみ続けたことがあり悔しいのでメモ

## Next.jsのHydration

Next.jsのLinkコンポーネントは、Link要素が画面にスクロールした段階で遷移先のデータをfetchして事前にJavascript実行の準備をする（Hydration）

Next.jsで作成されたサイトで画面をシャカシャカスクロールしていくと、Headタグ内部のlinkが増えていくのがわかる

```bash
<link as="script" rel="prefetch" href="/_next/static/…js”>
```

それにより高速な画面遷移を実現、便利〜！というシステムである

[Components: \<Link\>](https://nextjs.org/docs/app/api-reference/components/link)

ただし、事前にfetchしたデータと実際に描画するデータが異なる場合、hydration errorとなる

## iOS Safariの電話番号の扱い

[Supported Meta Tags](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html)

> By default, Safari on iOS detects any string formatted like a phone number and makes it a link that calls the number.
> 

関係ない文字列だろうと、意図せぬリンク化をしてくれるらしい。

これが先程言及したhydration errorを引き起こす

1. SSGでexportしてHTMLになる
2. Linkコンポーネントによって遷移先のページのデータがfetchされる
3. ページ遷移をする
4. 遷移先のページでSafariが電話番号を発見、いい感じに解釈してリンクコンポーネントとなる
5. 事前にfetchしたデータと差異が出てhydration errorを引き起こす

となる。

これを防ぐためにmetaで無効化する必要がある

```bash
<meta name="format-detection" content="telephone=no">
```
