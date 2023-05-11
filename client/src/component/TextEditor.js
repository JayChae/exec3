import React from "react";
import Axios from "axios";
import { server_url } from "../config/url";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";

const TextEditor = ({ setContent }) => {
  const { userId } = useParams("");
  const imgLink = server_url + "/images/";

  useEffect(() => {
    return async () => {
      console.log("unmount");
      await Axios.post(`${server_url}/api/temp_delete/${userId}`);
    };
  }, []);


  const customUploadAdapter = (loader) => {
    return {
      upload() {
        return new Promise((resolve, reject) => {
          const data = new FormData();
          loader.file.then((file) => {
            data.append("name", file.name);
            data.append("file", file);
            Axios.post(`${server_url}/api/upload/${userId}`, data)
              .then((res) => {
                resolve({
                  default: `${imgLink}/temp/${userId}/${res.data.filename}`,
                });
              })
              .catch((err) => reject(err));
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    // (3)
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return customUploadAdapter(loader);
    };
  }

  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "blockQuote",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "specialCharacters",
        "|",
        "bulletedList",
        "numberedList",
        "todoList",
        "insertTable",
        "horizontalLine",
        "|",
        "alignment",
        "outdent",
        "indent",
        "|",
        "link",
        // "imageInsert",
        // "mediaEmbed",
        "|",
        "undo",
        "redo",
        "|",
      ],
    },
    language: "ko",
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
    },
    table: {
      contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableCellProperties",
        "tableProperties",
      ],
    },
    mediaEmbed: {
      previewsInData: true,
    },
    extraPlugins: [uploadPlugin],
  };

  return (
    <CKEditor
      editor={Editor}
      config={editorConfiguration}
      data="<p>WRITE HERE!</p>"
      onChange={(event, editor) => {
        const data = editor.getData();
        setContent(data);
      }}
    />
  );
};

export default TextEditor;
