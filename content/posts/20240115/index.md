---
title: "findコマンドに変わる高速findコマンド、fdの導入"
date: 2024-01-15
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2024-01-15"
---

- [Introduction](#introduction)
- [特徴](#特徴)

## Introduction

ezaを導入する際にもうひとつ高速になるコマンドを発見

findの代用となる`fd`コマンド

[GitHub - sharkdp/fd: A simple, fast and user-friendly alternative to 'find'](https://github.com/sharkdp/fd)

# Install `fd`

```bash
brew install fd
```

## 特徴

- rust製なので高速
- git管理されたディレクトリ配下はgitignoreに従いfindをかけてくれる
    - node_moduleを除いてくれるのが非常にありがたい
- デフォルトで正規表現が使用できる、非常にありがたい

適当にルートディレクトリからfindをかけると、従来だと実行後不安になるくらい時間がかかるがfdの場合は数秒たたずに終わる、本当にはやい

エイリアス（もしくはabbreviation）の登録推奨。
