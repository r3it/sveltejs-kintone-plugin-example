import ConfigApp from './ConfigApp.svelte';

let pid = "testPid";
if (typeof kintone != "undefined") {
	pid = kintone.$PLUGIN_ID;
}

const configApp = new ConfigApp({
	target: document.querySelector('#bookshare-plugin'),
	props: {
		pluginID: pid
	}
});

export default configApp;
