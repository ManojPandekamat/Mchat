import axios from "axios";
import { useData } from "../Context/Context";
import '../Styles/chatCard.css'
import copyPng from "../public/copy.png"

function ChatCard(params) {
  const { me } = useData();
  const downloadFile = async (e) => {
    e.preventDefault();
    console.log(
      `${process.env.REACT_APP_BACKEND_ADDRESS}/download/${params?.filename}`
    );
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/download/${params?.filename}`,
        {
          responseType: "blob",
        }
      );
      console.log("Requesting", params.filename);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", params?.filename.split("==")[1]); // original file name
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url); // clean up
    } catch (e) {
      console.error("Download failed", e);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      let alert= document.getElementById("alert")
      alert.innerText="Copied Content"
      alert.style.display="flex"
      setTimeout(()=>{
        alert.style.display="none"

      },2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  /**
{
  "#F8ECD6": { bg: "#F8ECD6", text: "#3B2F0B" },  // Pale almond
  "#F5E5C0": { bg: "#F5E5C0", text: "#4B371C" },  // Soft beige
  "#F9EFD7": { bg: "#F9EFD7", text: "#5A4600" },  // Creamy tan
  "#FFF3DC": { bg: "#FFF3DC", text: "#403100" },  // Buttercream
  "#F5EAD3": { bg: "#F5EAD3", text: "#2F2A1F" },  // Light sand
  "#FBECC3": { bg: "#FBECC3", text: "#3C3000" },  // Warm cream
  "#F7E5C1": { bg: "#F7E5C1", text: "#514126" }   // Honey beige
}

 */
  return (
    <div
      style={{
        backgroundColor: params.by === me ? "#4B371C" : "#7d5c32ff",
        padding: "10px",
        gap: "0.3rem",
        display: "flex",
        flexDirection: "column",
        borderRadius: "10px",
        maxWidth: "80%",
        overflow: "wrap",
        color: "#FFEBCD",
        alignSelf: params.by === me ? "flex-end" : "flex-start",
      }}
    >
      <section id="alert"
>
      </section>
      <section
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "1rem",
          justifyContent: "space-between",
          alignItems: "center",
          padding:"0.1rem 0.2rem 0.1rem 0.2rem",
          borderRadius:"2px",
        }}
      >
        <span
        style={{
          paddingLeft:"0.4rem",
          paddingRight:"0.4rem",
          textAlign:"center",
          display:"flex",
          justifyContent:"center",
          alignItems:"center",
          fontSize:"0.8rem",
          borderRadius:"2px",
          backgroundColor: "#FFEBCD",
          color:params.by === me ? "#4B371C" : "#7d5c32ff"
        }}
        >{params.by[0]}</span>
        <section
        style={{
          fontWeight:600

        }}
        >{params.by || "Ananomous"}</section>
        <section
        style={{
          fontWeight:500

        }}
        >{params.time || "Now"}</section>
        {!params?.file && (
          <section>
            <button
              style={{
                backgroundColor: "#FFF8DC",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              title="copy text"
              onClick={() => copyToClipboard(params.data || "")}
            >
              <img
                style={{
                  width: "12px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                src={copyPng}
                alt="copy"
              ></img>
            </button>
          </section>
        )}
      </section>

      {params?.file ? (
        <section>
          <p
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontFamily: "inherit",
              display: "flex",
              justifyContent: params.by === me ? "flex-end" : "flex-start",
              alignItems: "center",
              margin: 0,
              color: "#FFEBCD",
            }}
          >
            {params.filename.split("==")[1] || ""}
          </p>

          <button
            style={{
              backgroundColor: "#FFF8DC",
              color: "#5A4600",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
            }}
            onClick={downloadFile}
          >
            Download
          </button>
        </section>
      ) : (
        <section>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontFamily: "inherit",
              display: "flex",
              justifyContent: params.by === me ? "flex-end" : "flex-start",
              alignItems: "center",
              margin: 0,
            }}
          >
            {params.data || ""}
          </pre>
        </section>
      )}
    </div>
  );
}

export default ChatCard;
