import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { GraphData } from "./graphData";

import "./App.css";

const sizeData = { x: 450, y: 700 };

export const Home = ({ token }) => {
  const [mapData, setMapData] = useState(null);

  useEffect(async () => {
    const binaryData = await getBinaryTree();
    setMapData(GraphData.populateGraphData(JSON.stringify(binaryData)));
  }, []);

  async function getTree() {
    return fetch("http://localhost:8080/api/get_child_node_users", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.token,
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
    }).then((data) => data.json());
  }

  const getBinaryTree = async () => {
    // TODO: remove hard coded parent node.
    let constructTree = { user_1: {} };
    const data = await getTree();

    if (Array.isArray(data)) {
      for (let j = 1; j < data.length; j++) {
        let placementStr = "";

        if (data[j].position === "L") {
          placementStr = placementStr + ".1";
        } else if (data[j].position === "R") {
          placementStr = placementStr + ".2";
        }

        let curUIDDrop = data[j].father;

        while (curUIDDrop !== 1 && curUIDDrop !== 0 && curUIDDrop !== -1) {
          for (let k = 1; k < data.length; k++) {
            if (data[k].position !== null && data[k].father !== -1) {
              if (data[k].id === curUIDDrop) {
                if (data[k].position === "L") {
                  placementStr = placementStr + ".1";
                } else if (data[k].position === "R") {
                  placementStr = placementStr + ".2";
                }
                curUIDDrop = data[k].father;
                continue;
              }
            }
          }
        }

        if (placementStr.charAt(0) == ".") {
          placementStr = placementStr.substring(1, placementStr.length);
        }

        placementStr = reverse(placementStr);
        function reverse(s) {
          return s.split("").reverse().join("");
        }

        if (placementStr.length > 0) {
          constructTree["user_1"][placementStr] =
            data[j].user_name.toUpperCase();
        }
      }

      const ordered = Object.keys(constructTree["user_1"])
        .sort()
        .reduce((obj, key) => {
          obj[key] = constructTree["user_1"][key];
          return obj;
        }, {});
      let res = { user_1: ordered };
      return res;
    }
  };

  const renderNodeWithCustomEvents = ({ nodeDatum, toggleNode }) => {
    return (
      <g>
        <foreignObject x="-150px" height="500px" width="500px" y="-80px">
          <div
            title={nodeDatum.fullName}
            className="elemental-node"
            style={nodeDatum.style}
          >
            <span title={nodeDatum.fullName} className="elemental-name">
              {nodeDatum.shortName}
            </span>
            {nodeDatum.fullName === false && (
              <div className="elemental-node--hover">
                <span>{nodeDatum.fullName}</span>
              </div>
            )}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <React.Fragment>
      {mapData !== null ? (
        <div className="graph">
          <Tree
            data={mapData.graph}
            renderCustomNodeElement={(rd3tProps) =>
              renderNodeWithCustomEvents({ ...rd3tProps })
            }
            orientation={"verticle"}
            translate={mapData.translate}
            zoom={0.2}
            nodeSize={sizeData}
            scaleExtent={{ min: 0.004, max: 1 }}
            separation={{ siblings: 1, nonSiblings: 1.5 }}
          />
        </div>
      ) : (
        <h2 className="loading">Loading</h2>
      )}
    </React.Fragment>
  );
};
