---
title: "1passwordの保管庫に登録した秘匿情報から`.env.local`ファイルの生成"
date: 2024-01-11
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2024-01-11"
---

- [Introduction](#introduction)
- [0. 前提](#0-前提)
- [1. 1passwordのデスクトップアプリ導入](#1-1passwordのデスクトップアプリ導入)
- [2. 保管庫にAPIキーの登録](#2-保管庫にapiキーの登録)
- [3. 1password CLI・vscode拡張機能をinstall](#3-1password-clivscode拡張機能をinstall)
- [4. `.env.local.template`ファイル作成](#4-envlocaltemplateファイル作成)
- [5. `.env.local`の作成](#5-envlocalの作成)
- [参考](#参考)

## Introduction

microCMSのAPIキー、取り扱うには非常に微妙なレベル。

もちろんAPIキーなのでそのへんにペタペタ貼るのは良くないため、ドキュメントないし全員が気軽に閲覧できる場所に貼って置くのは避けたい。

かといって、個人のDMでやりとりしてローカルに置くのも属人化して人間がいなくなったときに詰む。

どこに置けばいいのか迷っていたところ、1passwordに登録した値から`.env`ファイルを作成できるとこのこと。

## 0. 前提

- vscodeを使用している
- チームで1passwordを使用している

## 1. 1passwordのデスクトップアプリ導入

省略。勝手に入れてください。

## 2. 保管庫にAPIキーの登録

保管庫の作成方法はここでは触れないので、別途調べてください

「API認証情報」あたりから作成。今回はAPIキーとサービスIDだけあればよかったので認証情報とサービスIDだけ設定。

## 3. 1password CLI・vscode拡張機能をinstall

run the command in your shell

```jsx
brew install 1password-cli
```

https://marketplace.visualstudio.com/items?itemName=1Password.op-vscode

それぞれ導入

```jsx
op vault list
```

で疎通確認可能

## 4. `.env.local.template`ファイル作成

```jsx
touch .env.local.template
```

環境変数として登録したい値の秘密参照をコピー。

```jsx
ENVIRONMENT_VARIABLE="op//secret_reference"
```

あとは`.env.local.template`に適切なキー名と一緒に秘密参照を書いてあげる

## 5. `.env.local`の作成

```jsx
op inject --in-file .env.local.template --out-file .env.local
```

これで`.env.local`が生成される。

`.env.local.template`は秘密参照なので、そのままコミットしても問題なし！`.env.local`はコミットしないように（Next.js標準でgitignoreに追加されているが念のため）

## 参考

[Load secrets into the environment | 1Password Developer](https://developer.1password.com/docs/cli/secrets-environment-variables/)

[1Password CLIで.env.localを作る](https://cockscomb.hatenablog.com/entry/dotenv-managed-by-1password)

[1password cli を使った秘匿情報の取得](https://zenn.dev/kimuson/articles/7a95efed-7704-4c8f-8192-d6b1509c863c#1password-cli-%E3%82%92%E4%BD%BF%E3%81%A3%E3%81%9F%E7%A7%98%E5%8C%BF%E6%83%85%E5%A0%B1%E3%81%AE%E5%8F%96%E5%BE%97)
