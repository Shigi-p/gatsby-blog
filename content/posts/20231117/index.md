---
title: "Rust環境構築までの軌跡"
date: 2023-11-17
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2023-11-17"
---

- [Introduction](#introduction)
- [Install Rust](#install-rust)
  - [拡張機能入れる](#拡張機能入れる)
- [後日変な部分でひっかかった](#後日変な部分でひっかかった)

## Introduction

後輩「rust勉強したいので誰か一緒にやりませんか」

できらぁ！

## Install Rust

[はじめに](https://www.rust-lang.org/ja/learn/get-started)

公式はcurlで取ってこいって言ってるけど

何が何でもbrewで入れなければ気がすまないので

```jsx
brew install rust
```

を実行

cargoが入ってた、便利

自前の勉強用のリポジトリ持ってきて

```jsx
cargo run
```

したら動いた

楽〜〜〜〜〜！！！fish使ってるのに〜〜〜！！

一瞬で終わったわ……

### 拡張機能入れる

色々入れようかと思ったけど、何が適切なのかわからないから後で調べる

## 後日変な部分でひっかかった

ので、別の方法でinstallする

rustup経由

```jsx
brew install rustup-init
rustup-init
```

これやっておけば問題なさそうだったので一旦これで行う
