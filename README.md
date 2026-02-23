# WXT + React

This template should help get you started developing with React in WXT.


# 開発の記録
このマークダウンファイルは、開発の備忘録であり、一時的な記録ファイルです。せっかく初めてchrome拡張機能を作るので、どうせなら技術記事を書くところまでやりたいので、ちゃんと思い出せるように、未来の僕のために残します。いわば日報。これもリポジトリ内に置くのおもろいな。

## 開発環境構築   
**node, pnpmはインストール済み**
インストールしていない場合、node入れてnpmでインストールがおすすめ？   
node:    
pnpm: `npm install -g pnpm`   
wxtプロジェクト作成はこちら（[リンク](https://wxt.dev/guide/installation.html#next-steps)）
1. プロジェクト作成
  ターミナルでプロジェクトを作りたいフォルダの直下に移動し、以下を実行   
  `pnpm dlx wxt@latest init`
   1. プロジェクト名の入力
   1. テンプレートの選択（React）
   1. パッケージマネージャの選択（pnpm）
1. 作成したフォルダに移動して、vscodeでフォルダを開く   
  `cd ielove-shift-importer`   
  `code .`
1. 各種パッケージをインストール   
  `pnpm init`   
  `pnpm -i -D wxt`   
  `pnpm add -D tailwindcss @tailwindcss/vite`   
  `pnpm add -D prettier`   
1. 開発環境を立ち上げる   
  `pnpm run dev`   
ブラウザが開いて、拡張機能をクリックした際に、entrypoints/popup/main.tsxが表示されれば成功!

## プロジェクト構造
[これ](https://wxt.dev/guide/essentials/project-structure.html)を参照
