# Deno 2.2

https://deno.com/blog/v2.2

- Deno 2.2 で OpenTelemetry の機能がビルトイン
- console.log や Deno.serve、fetch などの API を自動的に計測できるように
- 簡単に試す方法として local に Docker を使い、LGTM stack を起動させるのが良い
  - https://github.com/grafana/docker-otel-lgtm/tree/main
- OpenTelemetry 用の API は今後も変更される可能性がある
  - `--unstable-otel`のフラグを使って利用できる

https://docs.deno.com/runtime/fundamentals/open_telemetry/

- ログ、メトリクス、トレースなどの計測機能を備えた OpenTelemetry observability ツールで、Deno のアプリケーションをモニタリングできるように
- OpenTelemetry プロトコルを使用して、収集されたメトリクス、トレースおよびログをサーバーにエクスポートする
- OpenTelemetry のメトリクス、トレース、ログを使用した Deno ランタイムの自動計装（Auto Instrumentatio）
- `npm:@opentelemetry/api`で提供されるユーザー定義のメトリクス、トレース、ログの収集
- 自動計装
- https://azukiazusa.dev/blog/deno-v2-2-opentelemetry/
  - OpenTelemetry を使ってテレメトリーデータを計装するには言語ごとの SDK を使う必要がある
  - Deno の Otel ビルトインサポートは追加の SDK のインストールや設定なし(自動計装？)で、アプリケーションからを利用できるように
  - デフォルトだと losalhost:4318 にエクスポートされる
  - OpenTelemetry Collector がエクスポートされたデータを受け取り加工、外部の監視サービスに送信する
- https://github.com/grafana/docker-otel-lgtm/tree/main
  - Loki, Grafana, Tempo が含まれた LGTM スタックの Docker イメージ
  - https://grafana.com/blog/2024/03/13/an-opentelemetry-backend-in-a-docker-image-introducing-grafana/otel-lgtm/
  - OpenTelemetry Collector は 4317(gRPC)と 4318(HTTP)で OpenTelemetry のデータを受信する
  - メトリクスを Prometheus に転送、スパンを Tempo へ、ログを Loki に記録
  - Grafana ではこの 3 つのデータベースが全てデータソースとして構成されていて、3000 で Web UI が公開される

```bash
# ホストのポートとコンテナのポートをマッピング
docker run --name lgtm -p 3000:3000 -p 4317:4317 -p 4318:4318 --rm -ti \
  # コンテナ内のフォルダにホストのフォルダをマウント
	-v "$PWD"/lgtm/grafana:/data/grafana \
	-v "$PWD"/lgtm/prometheus:/data/prometheus \
	-v "$PWD"/lgtm/loki:/data/loki \
  # コンテナ内の環境変数を設定
	-e GF_PATHS_DATA=/data/grafana \
  # コンテナのイメージを指定
	docker.io/grafana/otel-lgtm:0.8.1
```

- Prometheus
  - https://prometheus.io/docs/prometheus/latest/getting_started/
  - メトリクスの収集(DB)
- Loki
  - https://grafana.com/oss/loki/
  - ログの収集
- Tempo
  - https://grafana.com/oss/tempo/
  - トレースの収集
- Grafana
  - https://github.com/grafana/grafana
  - 可視化プラットフォーム
- Loki、Tempo、Grafana は Grafana Labs が開発したコンポーネント
- Prometheus は OSS
  - Cloud Native Computing Foundation のプロジェクトに
  - Grafana Labs はコントリビューターの一つ
  - Mimir という形で Prometheus 互換のコンポーネントと提供
- 実際に Grafana で確認できる
  - loki と prometheus は`{service_name="unknown_service"}`をクエリに指定するデータが表示される
- service_name を指定したい
  - 環境変数をつけたら良さそう
  - `service.name: If OTEL_SERVICE_NAME is not set, the value is set to <unknown_service>.`
  - https://docs.deno.com/runtime/fundamentals/open_telemetry/#deno.serve
- Deno では一部のオブザーバビリティデータを自動的に収集し、OTLP エンドポイントにエクスポートする
  - トレース
    - Deno.serve で受信した HTTP リクエスト
    - fetch で送信した HTTP リクエスト
  - メトリクス
    - Deno.serve
      - http.server.request.duration
        - 処理された HTTP リクエストの受信時間のヒストグラム
      - http.server.active_requests
        - 受信されたがまだ応答されていないリクエストの数
      - http.server.request.body.size
        - リクエスト本文のサイズ
      - http.server.response.body.size
        - レスポンス本文のサイズ
  - ログ
    - console.\*で作成されたログ
    - Deno ランタイムによって作成されたログ
    - Deno ランタイムの終了を引き起こすエラー
- OpenTelemetry の integration は、`OTEL_DENO=true`
- https://github.com/deno-otel
  - Deno OpenTelemetry の org

## TODO:

以下の内容を調べてみる

- telemetry.sdk.language: deno-rust"
- telemetry.sdk.name: "deno-opentelemetry"
- telemetry.sdk.version: "2.2.3-0.27.1"
