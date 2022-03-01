import React, { useState, useEffect } from "react";
import styled from "styled-components";

const WarpDiv = styled.div`
  @import url("https://fonts.googleapis.com/css?family=Ubuntu");
  padding: 90px;
  * {
    font-family: Ubuntu;
  }
`;

export default function About({ token }) {
  const [binaryCommision, setBinaryCommision] = useState(0);
  const [lbv, setLbv] = useState(0);
  const [rbv, setRbv] = useState(0);

  useEffect(async () => {
    const binaryData = await getBinaryTree();
    consolidateApplicationOrders(binaryData);
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

  async function getOrders() {
    return fetch("http://localhost:8080/api/commission_by_id", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token.token,
        "Content-Type": "application/x-www-form-urlencoded",
        "Access-Control-Allow-Origin": "*",
      },
    }).then((data) => data.json());
  }

  const consolidateApplicationOrders = async (binTree) => {
    const getOrderData = await getOrders();
    let r = 0;
    let l = 0;
    let binCom = 0;

    function getKeyByValue(object, value) {
      return Object.keys(object).find((key) => object[key] === value);
    }

    for (let i = 0; i < getOrderData.length; i++) {
      if (getOrderData[i].user_id !== 1) {
        const userPosition = getKeyByValue(
          binTree,
          getOrderData[i].user_id.toString()
        );

        if (userPosition !== undefined && userPosition.charAt(0) === "1") {
          l = l + getOrderData[i].volume;
        } else if (
          userPosition !== undefined &&
          userPosition.charAt(0) === "2"
        ) {
          r = r + getOrderData[i].volume;
        }
      }
    }

    setRbv(r);
    setLbv(l);

    if (r > l) {
      binCom = Math.floor(r / 200) * 20;
    } else {
      binCom = Math.floor(l / 200) * 20;
    }
    setBinaryCommision(binCom);
  };

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
          constructTree["user_1"][placementStr] = data[j].id.toString();
        }
      }

      const ordered = Object.keys(constructTree["user_1"])
        .sort()
        .reduce((obj, key) => {
          obj[key] = constructTree["user_1"][key];
          return obj;
        }, {});

      console.log("ORDERED BIN TREE : " + JSON.stringify(ordered));
      return ordered;
    }
  };

  return (
    <WarpDiv>
      <h1>User_1</h1>
      <h2>Binary Commission: ${binaryCommision}</h2>
      <h3>LBV: {lbv}</h3>
      <h3>RBV: {rbv}</h3>
    </WarpDiv>
  );
}
