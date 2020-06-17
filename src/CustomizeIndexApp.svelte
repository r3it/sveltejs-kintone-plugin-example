<script>
  import { onMount, onDestroy } from "svelte";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";

  export let records;
</script>

<main>

  {#if records.length == 0}
    <div>蔵書は見つかりませんでした。</div>
  {/if}

  {#if records.length > 0}
    <div>
      <DataTable>
        <Head>
          <Row>
            <Cell>タイトル</Cell>
            <Cell>表紙</Cell>
          </Row>
        </Head>
        <Body>
          {#each records as book}
            <Row>
              <Cell>{book['タイトル'].value}</Cell>
              <Cell>
                <img
                  src="https://images-na.ssl-images-amazon.com/images/P/{book['isbn'].value}.09.MZZZZZZZ.jpg" />
              </Cell>
            </Row>
          {/each}
        </Body>
      </DataTable>
    </div>
  {/if}

</main>
