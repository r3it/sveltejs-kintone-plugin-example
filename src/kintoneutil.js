function newKintoneUtil() {
  let pluginId;
  let formSchema;

  return {
    init: async (pid) => {
      pluginId = pid;
    },
    getConfig: () => {
      if (typeof kintone != "undefined") {
        let conf = kintone.plugin.app.getConfig(pluginId);
        if ("appKey" in conf) {
          return conf;
        }
      }
      return null;
    },
    setConfig: (setValues) => {
      if (typeof kintone != "undefined") {
        kintone.plugin.app.setConfig(setValues);
      }
    },
    getLibraries: async (params) => {
      if (typeof kintone != "undefined") {
        let url = `https://api.calil.jp/library?appkey=${params.appKey}&format=json&callback=&pref=${encodeURI(params.pref)}`;
        if (params.city != "") {
          url += `&city=${encodeURI(params.city)}`
        }
        let result;
        await kintone.proxy(url, 'GET', { 'Content-Type': 'application/json' }, {})
          .then(resp => {
            return JSON.parse(resp[0]).map(r => {
              return {
                systemid: r.systemid,
                name: r.formal,
                address: r.address
              }
            })
          })
          .then(resp => {
            result = resp;
          })
          .catch(err => {
            alert(err);
          });
        return result;

      } else {
        // mock object
        return [
          {
            "category": "MEDIUM",
            "city": "上尾市",
            "short": "たちばな分館",
            "libkey": "たちばな",
            "pref": "埼玉県",
            "primary": false,
            "faid": null,
            "geocode": "139.553924,35.947242",
            "systemid": "Saitama_Ageo",
            "address": "埼玉県上尾市平方1713-1",
            "libid": "103270",
            "tel": "048-782-1919",
            "systemname": "埼玉県上尾市",
            "isil": "JP-1000671",
            "post": "362-0059",
            "url_pc": "http://www.city.ageo.lg.jp/ageolib/index.html",
            "formal": "上尾市図書館たちばな分館"
          }, {
            "category": "MEDIUM",
            "city": "上尾市",
            "short": "上尾市図書館",
            "libkey": "上尾図書館",
            "pref": "埼玉県",
            "primary": true,
            "faid": null,
            "geocode": "139.5887392,35.9770416",
            "systemid": "Saitama_Ageo",
            "address": "埼玉県上尾市上町1-7-1",
            "libid": "103271",
            "tel": "048-773-8521",
            "systemname": "埼玉県上尾市",
            "isil": "JP-1000668",
            "post": "362-0037",
            "url_pc": "http://www.city.ageo.lg.jp/ageolib/index.html",
            "formal": "上尾市図書館"
          }
        ].map(r => {
          return {
            systemid: r.systemid,
            name: r.formal,
            address: r.address
          }
        });
        ;
      }
    },
    checkStatus: async (params) => {
      if (typeof kintone != "undefined") {
        let url = `https://api.calil.jp/check?appkey=${params.appKey}&isbn=${params.isbn}&systemid=${params.systemIDList}&format=json&callback=no`;
        let result;
        await kintone.proxy(url, 'GET', { 'Content-Type': 'application/json' }, {})
          .then(resp => {
            return result = JSON.parse(resp[0])
          })
          .catch(err => {
            alert(err);
          });
        return result;
      }
    },
    checkStatusAgain: async (params) => {
      if (typeof kintone != "undefined") {
        let url = `https://api.calil.jp/check?appkey=${params.appKey}&session=${params.session}&format=json&callback=no`;
        let result;
        await kintone.proxy(url, 'GET', { 'Content-Type': 'application/json' }, {})
          .then(resp => {
            console.log(resp[0]);
            return result = JSON.parse(resp[0])
          })
          .catch(err => {
            alert(err);
          });
        return result;
      }
    }
  };
}

export const kintoneUtil = newKintoneUtil();
