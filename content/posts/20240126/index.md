---
title: "配列の値から型を作って強固な型作りたいよね〜〜〜"
date: 2024-01-26
tags:
  - 技術
banner: ./book_nikkichou_diary.png
slug: "/2024-01-26"
---

- [Introduction](#introduction)
- [配列の値から型を作る](#配列の値から型を作る)

## Introduction

後輩と雑談してたら、そういえば実際の配列の値から型って生成できないんだっけ……？ってなった

## 配列の値から型を作る

[number]のようにindexで使用するものを指定する

```tsx
const roles = ['Admin', 'User', 'Guest'] as const;

type MyCompaniesRole = typeof roles[number];    // "Admin" | "User" | "Guest"

const myRole01: MyCompaniesRole = 'Admin';      // OK
const myRole02: MyCompaniesRole = 'SuperAdmin'; // Error
```

rolesに型指定すると強固にならない、不思議〜〜〜（調べる）

```tsx
const roles: string[] = ['Admin', 'User', 'Guest'] as const;

type MyCompaniesRole = typeof roles[number];    // "Admin" | "User" | "Guest"

const myRole01: MyCompaniesRole = 'Admin';      // OK
const myRole02: MyCompaniesRole = 'SuperAdmin'; // これもOK
```
