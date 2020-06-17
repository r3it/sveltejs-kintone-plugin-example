<script>
  import { onMount, onDestroy } from "svelte";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import LinearProgress from "@smui/linear-progress";
  import { kintoneUtil } from "./kintoneutil.js";

  export let pluginID;
  export let isbn;
  const img = `https://images-na.ssl-images-amazon.com/images/P/${isbn}.09.MZZZZZZZ.jpg`;
  let libraries = [];
  let frame;
  const interval = 4000;

  kintoneUtil.init(pluginID);
  let config = { appKey: "", systemIDList: "", pref: "", city: "" };
  let session = "";
  let loading = true;

  onMount(async () => {
    if (kintoneUtil.getConfig() != null) {
      config = kintoneUtil.getConfig();

      const result = await kintoneUtil.checkStatus({
        appKey: config.appKey,
        isbn,
        systemIDList: config.systemIDList
      });
      session = result.session;
      renderResult(result);
    }
  });

  // 画面描画ループ
  let start = window.performance.now();
  (function update() {
    if (window.performance.now() - start >= interval) {
      refresh();
      start = window.performance.now();
    }
    frame = requestAnimationFrame(update);
  })();

  onDestroy(() => {
    cancelAnimationFrame(frame);
  });

  async function refresh() {
    const result = await kintoneUtil.checkStatusAgain({
      appKey: config.appKey,
      session
    });
    session = result.session;
    renderResult(result);

    if (result.continue == 0) {
      loading = false;
      cancelAnimationFrame(frame);
    }
  }

  function renderResult(result) {
    libraries = [];
    let book = result.books[isbn];

    let libkeys = Object.keys(book)
      .filter(key => {
        return (
          (book[key].status === "OK" || book[key].status === "Cache") &&
          Object.keys(book[key].libkey).length > 0
        );
      })
      .map(key => {
        return {
          systemid: key,
          libkey: book[key].libkey
        };
      });

    for (let libkey of libkeys) {
      let systemid = libkey.systemid;
      Object.keys(libkey.libkey).forEach(name => {
        libraries.push({
          systemid,
          name,
          status: libkey.libkey[name],
          link: `https://calil.jp/library/search?s=${systemid}&k=${encodeURI(
            name
          )}`
        });
      });
    }
  }
</script>

<main>

  <div class="pl-8">
    <a href="https://calil.jp/book/{isbn}" target="_blank">
      <img src={img} />
    </a>
  </div>

  {#if loading}
    <div class="pt-5">
      <LinearProgress indeterminate />
    </div>
  {/if}

  {#if !loading && libraries.length == 0}
    <div>蔵書は見つかりませんでした。</div>
  {/if}

  {#if libraries.length > 0}
    <div>
      <DataTable>
        <Head>
          <Row>
            <Cell>図書館名</Cell>
            <Cell>ステータス</Cell>
          </Row>
        </Head>
        <Body>
          {#each libraries as lib}
            <Row>
              <Cell>{lib.name}</Cell>
              <Cell>
                <a href={lib.link} target="_blank">{lib.status}</a>
              </Cell>
            </Row>
          {/each}
        </Body>
      </DataTable>
    </div>
  {/if}

</main>
