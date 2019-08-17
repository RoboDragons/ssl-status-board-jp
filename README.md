# SSL Status Board (Japanese)

A Status Board for the Small Size League, optimized to show the current game state on a large screen.

## ビルド

フロントエンドのリソースまで一緒に埋め込まれたシングルバイナリ`cmd/ssl-status-board/ssl-status-board`が生成されます。
生成された実行ファイル単体で動きます。

ビルドには`go`と`yarn`が必要です。
また、`go get`により`packr`がインストールされます。
環境変数`GOPATH`の設定と、`$GOPATH/bin`を`PATH`に追加するのを忘れないでください。

オフラインでキャッシュからビルドする場合は
`build.sh`内の`go get`コマンドの`-u`オプションを削除してください。

```console
$ ./build.sh
```

## 設定

`-c`オプションで指定したyamlファイル
(デフォルトでは`board-config.yaml`)
を読み込みます。
以下はデフォルト設定をyamlとして書いたものです。

```yaml
ListenAddress: ":8082"
RefereeConfig: 
  Connection:
    SubscribePath: "/api/referee"
    SendingInterval: "100ms"
    MulticastAddress: "224.5.23.1:10003"
```

## チーム追加

`src/assets/logos/`内にロゴの画像ファイル
(512x512px、png)
を置き、
`src/teamLogoUrl.js`
の`knownLogos`に登録します。
キーは
[ssl-game-controller](https://github.com/RoboCup-SSL/ssl-game-controller)
の`src/components/settings/team/TeamName.vue`内の`TEAMS`に書かれたチーム名をJSで`.toLowerCase().replace(' ', '-')`した文字列です。