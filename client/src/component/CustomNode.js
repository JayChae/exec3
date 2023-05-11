import React from "react";
import { v4 as uuidv4 } from "uuid";
import { RiBuilding4Fill, RiUserStarFill, RiUserFill } from "react-icons/ri";

import { IoMdAdd } from "react-icons/io";
import { IoSwapHorizontal } from "react-icons/io5";
import { BiX } from "react-icons/bi";

const CustomNode = ({
  root,
  nodeDatum,
  foreignObjectProps,
  treeData,
  setTreeData,
  editState,
}) => {

  const getNodeById = (node, id) => {
    if (node.id === id) {
      return node;
    } else if (node.children) {
      let result = null;
      for (let i = 0; result == null && i < node.children.length; i++) {
        result = getNodeById(node.children[i], id);
      }
      return result;
    }
    return null;
  };

  const findParent = (node, child) => {
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        const childNode = node.children[i];
        if (childNode.id === child.id) {
          return node;
        } else {
          const parent = findParent(childNode, child);
          if (parent) {
            return parent;
          }
        }
      }
    }
    return null;
  };

  const isLastChild = (node) => {

    const parent = findParent(treeData,node);
    if (parent) {
      const children = parent.children;
      const lastChild = children[children.length - 1];
      return node.id === lastChild.id;
    }
    return false;
  };

  const handleAddChildNodeClick = (nodeData) => {
    // Create a new child node with the specified name and unique ID
    const newNode = {
      id: uuidv4(),
      name: "이름",
      state: "직위/직급",
      description: "직무",
      department: "부서",
      type: "employee",
    };

    // Find the clicked node in the tree using its unique identifier
    const clickedNode = getNodeById(treeData, nodeData.id);

    // Add the new child node to the clicked node
    if (clickedNode.children) {
      clickedNode.children.push(newNode);
    } else {
      clickedNode.children = [newNode];
    }

    // Update the tree data with the new node
    setTreeData({ ...treeData });
  };

  const handleEditNode = (nodeData) => {
    // Prompt the user for the new name of the node
    const nodeName = prompt("이름을 입력하세요. : ", nodeData.name);

    // Return early if the user cancelled the prompt or entered the same name
    if (!nodeName || nodeName === nodeData.name) {
      return;
    }

    // Find the node in the tree using its unique identifier
    const editedNode = getNodeById(treeData, nodeData.id);

    // Update the name of the selected node
    editedNode.name = nodeName;

    // Update the tree data with the edited node
    setTreeData({ ...treeData });
  };

  const handleEditState = (nodeData) => {
    // Prompt the user for the new description of the node
    const nodeState = prompt("직급, 직위를 입력하세요. : ", nodeData.state);

    // Return early if the user cancelled the prompt or entered the same description
    if (!nodeState || nodeState === nodeData.state) {
      return;
    }

    // Find the node in the tree using its unique identifier
    const editedNode = getNodeById(treeData, nodeData.id);

    // Update the description of the selected node
    editedNode.state = nodeState;

    // Update the tree data with the edited node
    setTreeData({ ...treeData });
  };

  const handleEditDescription = (nodeData) => {
    // Prompt the user for the new description of the node
    const nodeDescription = prompt(
      "직무, 설명을 입력하세요. : ",
      nodeData.description
    );

    // Return early if the user cancelled the prompt or entered the same description
    if (!nodeDescription || nodeDescription === nodeData.description) {
      return;
    }

    // Find the node in the tree using its unique identifier
    const editedNode = getNodeById(treeData, nodeData.id);

    // Update the description of the selected node
    editedNode.description = nodeDescription;

    // Update the tree data with the edited node
    setTreeData({ ...treeData });
  };

  const handleEditIcon = (nodeData) => {
    const editType = nodeData.type === "employee" ? "leader" : "employee";

    // Find the node in the tree using its unique identifier
    const editedNode = getNodeById(treeData, nodeData.id);

    // Update the name of the selected node
    editedNode.type = editType;

    // Update the tree data with the edited node
    setTreeData({ ...treeData });
  };

  const handleEditDepartment = (nodeData) => {
    // Prompt the user for the new description of the node
    const nodeDepartment = prompt(
      "부서을 입력하세요. : ",
      nodeData.department
    );

    // Return early if the user cancelled the prompt or entered the same description
    if (!nodeDepartment || nodeDepartment === nodeData.department) {
      return;
    }

    // Find the node in the tree using its unique identifier
    const editedNode = getNodeById(treeData, nodeData.id);

    // Update the description of the selected node
    editedNode.department = nodeDepartment;

    // Update the tree data with the edited node
    setTreeData({ ...treeData });
  };

  const deleteNode = (nodeData) => {
    // Find the parent of the node to be deleted
    const parent = findParent(treeData, nodeData);

    // Remove the selected node from its parent's children array
    parent.children = parent.children.filter(
      (child) => child.id !== nodeData.id
    );

    // Update the tree data without the deleted node
    setTreeData({ ...treeData });
  };


  const swapNodeWithNext = (nodeData) => {
    const parent = findParent(treeData, nodeData);
    const index = parent.children.findIndex((child) => child.id === nodeData.id);
  
    if (index >= 0 && index < parent.children.length - 1) {
      // Swap the node with its next sibling
      const updatedChildren = [...parent.children];
      [updatedChildren[index], updatedChildren[index + 1]] = [
        updatedChildren[index + 1],
        updatedChildren[index],
      ];
  
      // Update parent node children
      parent.children = updatedChildren;
  
      // Update treeData
      setTreeData({ ...treeData });
    }
  };

  //return
  if (root) {
    return (
      <g>
        {/* `foreignObject` requires width & height to be explicitly set. */}
        <foreignObject {...foreignObjectProps}>
        <div className="department">
                <text
                  className={`department-name ${editState ? "editable" : ""}`}
                  onClick={editState ? () => handleEditDepartment(nodeDatum) : () => {}}
                >{nodeDatum.department}</text>
                </div>
          <div className="boarding-card">
            <RiBuilding4Fill className="icons" />
            <div className="text-box">
              <text
                className={`boarding-name ${editState ? "editable" : ""}`}
                onClick={editState ? () => handleEditNode(nodeDatum) : () => {}}
              >
                {nodeDatum.name}
              </text>
              <text
                className={`boarding-state ${editState ? "editable" : ""}`}
                onClick={
                  editState ? () => handleEditState(nodeDatum) : () => {}
                }
              >
                {nodeDatum.state}
              </text>
              <text
                className={`boarding-description ${
                  editState ? "editable" : ""
                }`}
                onClick={
                  editState ? () => handleEditDescription(nodeDatum) : () => {}
                }
              >
                {nodeDatum.description}
              </text>
            </div>
            {editState ? (
              <IoMdAdd
                className="add"
                onClick={() => handleAddChildNodeClick(nodeDatum)}
              />
            ) : null}
          </div>
        </foreignObject>
      </g>
    );
  } else {
    return (
      <g onClick={()=>{console.log("datanum",nodeDatum)}}>
        <foreignObject {...foreignObjectProps}>
          {nodeDatum.type === "leader" ? (
                <div className="department">
                  <text
                    className={`department-name ${editState ? "editable" : ""}`}
                    onClick={editState ? () => handleEditDepartment(nodeDatum) : () => {}}
                  >{nodeDatum.department}</text>
                  </div>
          ) : null}

          <div className="boarding-card">
            {editState ? (
              <BiX className="delete" onClick={() => deleteNode(nodeDatum)} />
            ) : null}
            {nodeDatum.type === "employee" ? (
              <RiUserFill
                className={`icons ${editState ? "editable" : ""}`}
                onClick={editState ? () => handleEditIcon(nodeDatum) : null}
              />
            ) : (
              <RiUserStarFill
                className={`icons ${editState ? "editable" : ""}`}
                onClick={editState ? () => handleEditIcon(nodeDatum) : null}
              />
            )}
             {editState && !isLastChild(nodeDatum) ? (
              <IoSwapHorizontal
              className="swap"
              onClick={()=>swapNodeWithNext(nodeDatum)}
            />
            ) : null}
             
            <div className="text-box">
              <text
                className={`boarding-name ${editState ? "editable" : ""}`}
                onClick={editState ? () => handleEditNode(nodeDatum) : () => {}}
              >
                {nodeDatum.name}
              </text>
              <text
                className={`boarding-state ${editState ? "editable" : ""}`}
                onClick={editState ? () => handleEditState(nodeDatum) : () => {}}
              >
                {nodeDatum.state}
              </text>
              <text
                className={`boarding-description ${
                  editState ? "editable" : ""
                }`}
                onClick={
                  editState ? () => handleEditDescription(nodeDatum) : () => {}
                }
              >
                {nodeDatum.description}
              </text>
            </div>
            {editState ? (
              <IoMdAdd
                className="add"
                onClick={() => handleAddChildNodeClick(nodeDatum)}
              />
            ) : null}
            </div>
        </foreignObject>
      </g>
    );
  }
};

export default CustomNode;
