import React, { useState } from "react";
import Tree from "react-d3-tree";
import '../CSS/InteractiveChart.css';
import CustomNode from "./CustomNode";

const InteractiveOrgChart = ({ treeData, setTreeData, editState }) => {

  // 250 200
  const nodeSize = { x: 300, y: 220 };
  const foreignObjectProps = {
    width: nodeSize.x,
    height: nodeSize.y,
    x: -(nodeSize.x / 2) + 11,
    y: -70,
  };


  const renderForeignObjectNode = ({ nodeDatum, foreignObjectProps }) => {
    if(nodeDatum.id==="rootNode"){
      return (
        <CustomNode
        root={true}
        nodeDatum={nodeDatum}
        foreignObjectProps={foreignObjectProps}
        treeData={treeData}
        setTreeData={setTreeData}
        editState={editState}
        />
      );
    }
    else {
      return (
        <CustomNode
        root={false}
        nodeDatum={nodeDatum}
        foreignObjectProps={foreignObjectProps}
        treeData={treeData}
        setTreeData={setTreeData}
        editState={editState}
        />
      );
    }
  };

  return (
    <div className="org-chart">
      <Tree
        data={treeData}
        nodeSize={nodeSize}
        translate={{ x: 800, y: 200 }}
        separation={{ siblings: 1, nonSiblings: 1 }}
        collapsible={false}
        orientation={"vertical"}
        pathFunc={"step"}
        allowForeignObjects
        renderCustomNodeElement={(rd3tProps) =>
          renderForeignObjectNode({ ...rd3tProps, foreignObjectProps })
        }
        // draggable={false}
      />
    </div>
  );
};

export default InteractiveOrgChart;