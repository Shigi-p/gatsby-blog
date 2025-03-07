---
title: "とってもシンプル、lefthook"
date: 2024-07-24
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2024-07-24"
---

- [Introduction](#introduction)
- [Install](#install)
- [設定ファイル](#設定ファイル)

## Introduction

久々なのでhusky + stagelintの構成を変えようと思った

[husky+lint-stagedからlefthookに乗り換えたので違いとか使えそうな設定とかまとめる](https://zenn.dev/kimuson/articles/husky_to_lefthook)

## Install

```yaml
yarn add leftfook -D
```

[GitHub - evilmartians/lefthook: Fast and powerful Git hooks manager for any type of projects.](https://github.com/evilmartians/lefthook)

## 設定ファイル

超楽

```yaml
pre-push:
  commands:
    ___:
      run: write your command

```

以下は例

```yaml
pre-push:
  commands:
    lint:
      run: yarn lint
    format:
      run: yarn format
```

この例だとlintとformatを順番に実行してくれる

順番に実行したいものをがーーっと書いていくのみ。

例だとpre-pushにしているが、色々使用できる。主に使用したくなるのはだいたい以下だと思っている

```yaml
"pre-commit",
"pre-push",

```

[lefthook/internal/config/available_hooks.go at master · evilmartians/lefthook](https://github.com/evilmartians/lefthook/blob/master/internal/config/available_hooks.go#L10-L40)
