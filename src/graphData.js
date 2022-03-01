export class GraphData {
  static colorCodes = [
    "#048A81",
    "#06D6A0",
    "#54C6EB",
    "#8A89C0",
    "#CA8DC6",
    "#FF93B3",
    "#FFA891",
    "#FFCD72",
    "#F9F871",
  ];
  static maxDepth = 1;
  static populateGraphData(jsonSchema) {
    this.maxDepth = 1;
    let legionNames = [];
    let json = jsonSchema ? jsonSchema : null;
    json = JSON.parse(json);
    let config = json[Object.keys(json)[0]];
    let childData = [],
      mapData = {};

    for (var prop in config) {
      let obj = config[prop];
      this.setKeyData(prop, childData, obj, legionNames);
    }
    mapData = {
      shortName: Object.keys(json)[0],
      fullName: null,
      children: childData,
      style: {
        background: this.colorCodes[0],
      },
    };
    const translateData = {
      x: window.innerWidth / 2 - 170,
      y: window.innerHeight / 2 - 15,
    };
    return {
      graph: mapData,
      defaultZoom: this.getDefaultZoom(Object.keys(config).length),
      maxDepth: this.maxDepth,
      legionData: legionNames,
      translate: translateData,
    };
  }

  static setKeyData(dataKey, obj, value, legionNames) {
    const key = dataKey.split(".");
    const maxValue = key.length - 1;
    let addChildData = false;
    if (parseInt(key[0], 10) > this.maxDepth) {
      this.maxDepth = parseInt(key[0], 10);
    }
    for (let i = 0; i < key.length; i++) {
      let id = parseInt(key[i], 10) - 1;
      if (obj[id]) {
        if (i === id) {
          obj = obj[id].children;
        } else {
          obj = obj[id].children;
          addChildData = true;
        }
      } else {
        if (i === maxValue) {
          if (addChildData) {
            obj.push(this.getSubNodeData(value, parseInt(key[0], 10)));
            addChildData = false;
          } else {
            if (maxValue === 0) legionNames.push(value);
            obj[id] = this.getSubNodeData(value, parseInt(key[0], 10));
          }
        } else {
          obj[id] = {};
        }
      }
    }
  }

  static getSubNodeData(value, depth) {
    const shortTitle = value.length >= 15 ? this.getShortName(value) : value;
    const fullName = value.length >= 15 ? value : null;
    return {
      shortName: shortTitle,
      fullName: fullName,
      children: [],
      style: {
        background: this.colorCodes[depth]
          ? this.colorCodes[depth]
          : this.colorCodes[depth % this.colorCodes.length],
      },
    };
  }

  static getShortName(name, limit) {
    return name.substr(0, limit || 15) + "..";
  }

  static getDefaultZoom(count) {
    let factor = 1;
    if (count <= 10) return factor;
    if (count < 20) {
      factor = 1;
    } else if (count < 60) {
      factor = 0.55;
    } else if (count < 100) {
      factor = 0.13;
    } else if (count < 200) {
      factor = 0.09;
    } else {
      factor = 0.04;
    }
    return factor;
  }
}
