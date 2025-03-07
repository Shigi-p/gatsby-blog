---
title: "ESlintでなんか躓く・新しい設定ファイルを試す"
date: 2023-11-15
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2023-11-15"
---

- [Introduction](#introduction)
- [eslint.cofig.js](#eslintcofigjs)
- [とりあえずの対応策](#とりあえずの対応策)

## Introduction

サクッと導入しようと思ったら思いの外躓いている

謎のエラー、調べたら出てくるeslint-loader系のエラーとはまた違ったものの様子


```json
"eslint": "^8.53.0",
"eslint-plugin-react": "^7.33.2"
```

## eslint.cofig.js

[Configuration Files (New) - ESLint - Pluggable JavaScript Linter](https://eslint.org/docs/latest/use/configure/configuration-files-new)

設定ファイルを変えればなんとかなると思ったらなんともならない

何だこのエラー……

[Bug: There was a problem loading formatter: ...\node_modules\eslint\lib\cli-engine\formatters\stylish · eslint/eslint · Discussion #17215](https://github.com/eslint/eslint/discussions/17215#discussioncomment-6752356)

![Untitled](./images/github_issue_comment.png)

おいおいおいおい

```bash
rm yarn.lock
rm -rf node_modules
yarn
```

↓

動くんかい！！！

[ESLintのconfigがどのように変わり得るか（flat configとは何か）](https://zenn.dev/makotot/articles/0d9184f3dde858)

う〜〜〜ん実験的なものと考えるとあんまり使用しないほうがよいかもなぁ

以前の設定ファイルと比べて、何を何に変えればいいのかあまり明示されておらず、移行はまだ早いような印象だった

## とりあえずの対応策

変なエラーが出たらとりあえず設定ファイルを全部消してもう一回入れ直す、という最強に力技で対応する

上記に上げたIssueでも同じようになっている様子……新たにパッケージを入れたりすると起こるのかな？暫定はこれで対応

```bash
rm yarn.lock
rm -rf node_modules
yarn
```
