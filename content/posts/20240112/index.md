---
title: "lsの代用として使用するexaがメンテナンスされなくなったためezaを使用する  "
date: 2024-01-12
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2024-01-12"
---

- [Introduction](#introduction)
- [Install `eza`](#install-eza)
  - [ファイルのみを表示](#ファイルのみを表示)
  - [ディレクトリのみを表示](#ディレクトリのみを表示)
  - [ディレクトリを優先して表示](#ディレクトリを優先して表示)
  - [余談：gitリポジトリのブランチ・ステータスの表示](#余談gitリポジトリのブランチステータスの表示)


## Introduction

> [exa](https://the.exa.website/) is a modern replacement for *ls*.
> 

と、かっこよく登場したlsの代用コマンドexaだが

> exa is unmaintained, use the [fork eza](https://github.com/eza-community/eza) instead.
> 
> 
> (This repository isn’t archived because the only person with the rights to do so is unreachable).
> 

とのことらしい。

なので、exaからezaに乗り換える

## Install `eza`

[GitHub - eza-community/eza: A modern, maintained replacement for ls](https://github.com/eza-community/eza)

```bash
brew install eza
```

> **eza** features not in exa (non-exhaustive):
> 
> - Fixes [“The Grid Bug”](https://github.com/eza-community/eza/issues/66#issuecomment-1656758327) introduced in exa 2021.
> - Hyperlink support.
> - Mount point details.
> - Selinux context output.
> - Git repo status output.
> - Human readable relative dates.
> - Several security fixes.
> - Support for `bright` terminal colours.
> - Many smaller bug fixes/changes!
> 
> ...and like, so much more that it became exhausting to update this all the time. Like seriously, we have a lot of good stuff.
> 

まぁ色々と書いてますが、標準のlsよりもカラフルで便利、くらいのニュアンスです

オプションの組み合わせによってリスト・フィルターが可能なので、以下から便利そうなものを抜粋、エイリアス（もしくはabbreviation）の設定を推奨。

[EZA: The Best LS Command Replacement](https://denisrasulev.medium.com/eza-the-best-ls-command-replacement-9621252323e)

### ファイルのみを表示

```bash
eza -alF --color=always --sort=size | grep -v /
```

参考にしたサイトではlsに割り当てていたが、lsに割り当てるのはちょっとびみょい気がしたので、別のエイリアスに割当

### ディレクトリのみを表示

```bash
eza -lD
```

### ディレクトリを優先して表示

```bash
eza -al --group-directories-first
```

個人的にはこれがしっくりきたのでlsに割り当て

### 余談：gitリポジトリのブランチ・ステータスの表示

```bash
eza -al --group-directories-first --git-repos
```

ls使用するときって大概git管理されたプロジェクトの中であって`—git-repos`はgit管理されたディレクトリの状態が見られる、なのであんまり使い時がないな〜〜って印象
