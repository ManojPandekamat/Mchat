import { useEffect, useState } from "react";

function FilePreview({ file }) {
  const [content, setContent] = useState("");
  const [html, setHtml] = useState(<></>);
  useEffect(() => {
    let url;

    const reader = new FileReader();
    if (file.type.startsWith("text/")) {
      reader.onload = (e) => setContent(e.target.result);

      reader.readAsText(file);
    } else {
      url = URL.createObjectURL(file);

      if (file.type.startsWith("application/pdf")) {
        setHtml(
          <iframe
            title={file.name}
            src={url}
            width="400"
            height="300"
            style={{ border: "none" }}
          />
        );
      } else if (file.type.startsWith("image/")) {
        setHtml(
          <img src={url} style={{ maxHeight: "200px" }} alt={file.name} />
        );
      } else {
        setHtml(<p>Cannot preview this file!</p>);
      }
    }
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [file]);
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h3>Preview of: {file.name}</h3>
        {content.length > 0 ? (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "#f4f4f4",
              padding: "10px",
              maxHeight: "300px",
              overflowY: "scroll",
              overflowX: "hidden",
            }}
          >
            {content}
          </pre>
        ) : (
          html && html
        )}
      </div>
    </div>
  );
}

export default FilePreview;
