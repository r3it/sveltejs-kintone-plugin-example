import CustomizeDetailApp from './CustomizeDetailApp.svelte';
import CustomizeIndexApp from './CustomizeIndexApp.svelte';

(function (PLUGIN_ID) {
  const spaceID = "detail";
  const viewID = "bookshare-plugin-view";
  const isbnFieldCode = "isbn";

  kintone.events.on(['app.record.detail.show'], function (event) {
    const space = kintone.app.record.getSpaceElement(spaceID);
    if (!space || !event.record[isbnFieldCode] || event.record[isbnFieldCode].value === "") {
      return event;
    }

    const detailApp = new CustomizeDetailApp({
      target: space,
      props: {
        pluginID: PLUGIN_ID,
        isbn: event.record[isbnFieldCode].value
      }
    });

    return event;
  });

  kintone.events.on(['app.record.index.show'], function (event) {
    if (!document.getElementById(viewID) || event.records.length == 0) {
      return;
    }

    const indexApp = new CustomizeIndexApp({
      target: document.getElementById(viewID),
      props: {
        records: event.records
      }
    })
  });

})(kintone.$PLUGIN_ID);
