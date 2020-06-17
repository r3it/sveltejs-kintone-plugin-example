<script>
  import Button, { Group, GroupItem, Label, Icon } from "@smui/button";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import Paper, { Title, Subtitle, Content } from "@smui/paper";
  import Select, { Option } from "@smui/select";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import LinearProgress from "@smui/linear-progress";
  import { onMount } from "svelte";
  import { kintoneUtil } from "./kintoneutil.js";

  export let pluginID;
  kintoneUtil.init(pluginID);

  let loading = false;
  let config = { appKey: "", systemIDList: "", pref: "", city: "" };
  $: disabled = config.systemIDList != "" && validate() ? false : true;

  let libraries = [];
  let errors = { appKey: false, pref: false };
  const prefs = new Array(
    "北海道",
    "青森県",
    "岩手県",
    "宮城県",
    "秋田県",
    "山形県",
    "福島県",
    "茨城県",
    "栃木県",
    "群馬県",
    "埼玉県",
    "千葉県",
    "東京都",
    "神奈川県",
    "新潟県",
    "富山県",
    "石川県",
    "福井県",
    "山梨県",
    "長野県",
    "岐阜県",
    "静岡県",
    "愛知県",
    "三重県",
    "滋賀県",
    "京都府",
    "大阪府",
    "兵庫県",
    "奈良県",
    "和歌山県",
    "鳥取県",
    "島根県",
    "岡山県",
    "広島県",
    "山口県",
    "徳島県",
    "香川県",
    "愛媛県",
    "高知県",
    "福岡県",
    "佐賀県",
    "長崎県",
    "熊本県",
    "大分県",
    "宮崎県",
    "鹿児島県",
    "沖縄県"
  );

  onMount(async () => {
    if (kintoneUtil.getConfig() != null) {
      config = kintoneUtil.getConfig();
    }
  });

  function validate() {
    let valid = true;

    if (config.appKey === "") {
      errors.appKey = true;
      valid = false;
    } else {
      errors.appKey = false;
    }
    if (config.pref === "") {
      errors.pref = true;
      valid = false;
    } else {
      errors.pref = false;
    }

    if (!valid) {
      return false;
    }
    return true;
  }

  async function search() {
    loading = true;
    if (validate()) {
      libraries = await kintoneUtil.getLibraries({
        appKey: config.appKey,
        pref: config.pref,
        city: config.city
      });
      // systemidは重複が多数あるので重複排除
      config.systemIDList = libraries
        .map(r => r.systemid)
        .filter((item, i, array) => {
          return array.indexOf(item) === i;
        })
        .join(",");
    } else {
      libraries = [];
      config.systemIDList = "";
    }
    loading = false;
  }

  function save() {
    loading = true;
    if (validate()) {
      kintoneUtil.setConfig(config);
    }
    loading = false;
  }
</script>

<main>
  {#if loading}
    <div class="pt-5">
      <LinearProgress indeterminate />
    </div>
  {/if}

  <div class="pt-15">
    <Button
      {disabled}
      on:click={save}
      variant="unelevated"
      color="primary"
      style="flex-grow: 3;">
      <Label>設定を保存</Label>
    </Button>
  </div>

  <div>
    <Textfield
      required
      variant="filled"
      bind:value={config.appKey}
      bind:invalid={errors.appKey}
      label="アプリケーションキー"
      input$aria-controls="helper-text-filled-a"
      input$aria-describedby="helper-text-filled-a" />
    <HelperText id="helper-text-filled-a">
      カーリルのアプリケーションキーを入力してください
    </HelperText>
  </div>

  <div class="pt-15">
    最寄りの図書館検索
    <br />
    <Select
      variant="filled"
      bind:value={config.pref}
      bind:invalid={errors.pref}
      on:change={((config.city = ''), (config.systemIDList = ''))}
      label="都道府県">
      <Option value="" />
      {#each prefs as pref}
        <Option value={pref} selected={config.pref === pref}>{pref}</Option>
      {/each}
    </Select>
    <Textfield
      required
      variant="filled"
      bind:value={config.city}
      on:change={(config.systemIDList = '')}
      label="市区町村"
      input$aria-controls="helper-text-filled-a"
      input$aria-describedby="helper-text-filled-a" />
    <HelperText id="helper-text-filled-a">
      ご希望の場合、市区町村を入力してください
    </HelperText>
  </div>

  <div class="pt-15">
    <Button color="secondary" on:click={search} variant="outlined">
      <Label>図書館検索</Label>
    </Button>
  </div>

  {#if libraries.length > 0}
    <div>
      <DataTable>
        <Head>
          <Row>
            <Cell>名称</Cell>
            <Cell>住所</Cell>
          </Row>
        </Head>
        <Body>
          {#each libraries as lib}
            <Row>
              <Cell>{lib.name}</Cell>
              <Cell>{lib.address}</Cell>
            </Row>
          {/each}
        </Body>
      </DataTable>
    </div>
  {/if}

</main>
