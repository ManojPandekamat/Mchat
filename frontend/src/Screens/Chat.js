import React, { useEffect, useRef, useState } from "react";
import { 
   useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Name from "../Components/Name";
import "../Styles/Chat.css";
import ChatCard from "../Components/ChatCard";
import { useData } from "../Context/Context";
import axios from "axios";
import FilePreview from "../Components/FilePreview";
import sendPng from "../public/send.png";
import uploadPng from "../public/upload.png"; 

function Chat() {
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [messages, setMessages] = useState([]);
  const textarearef = useRef(null);
  const dialogRef = useRef(null);
  const [code, setCode] = useState("");
  const [user, setUser] = useState("");
  const [userNameEntered, setuserNameEntered] = useState(false);
  const { me, setMe, users, setUsers } = useData();
  const params = useParams();
  const socket = useRef();
  const [response, setResponse] = useState("");
  const [state,setState]=useState("loading")
  // const [canMessage, setCanMessage] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const fileUploadRef = useRef(null);

  function handleUsernameSubmission() {
    setMe(user);
    dialogRef.current.close();
  }



  useEffect(() => {
    if (user.length >= 2) {
      setuserNameEntered(true);
    } else {
      setuserNameEntered(false);
    }
  }, [user]);

  useEffect(() => {
    setState("loading");
    setCode(params.roomId);

    dialogRef.current.showModal();

    async function loadData() {
      let data = await axios.get(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/data`,
        {
          params: { roomId: params.roomId },
        }
      );
      console.log(data.data);
      if (data.data.length !== 0) {
        setMessages((prev) => {
          const newMessages = data.data.filter((newMessage) => {
            return !prev.some(
              (oldMessage) => oldMessage._id === newMessage._id 
            );
          });
          return [...prev, ...newMessages];
        });
      }
    }
    loadData();

    socket.current = io(`${process.env.REACT_APP_BACKEND_ADDRESS}`);
    // console.log("id:" + params.roomId);

    socket.current.on("connect", () => {
      console.log("Connected to server");
    });

    socket.current.on("message", (response) => {
      console.log(response);

      setResponse(response);
    });

    socket.current.on("file", (response) => {});

    socket.current.on("handShake", (response) => {
      if (response.status) {
        setState("ready");
      } else {
        setState("error");
      }
    });

    socket.current.emit("handShake", {
      roomId: params.roomId,
      by: me,
    });

    socket.current.emit("roomMembers", {
      roomId: params.roomId,
    });

    socket.current.on("roomMembers", (response) => {
      setUsers(response);
    });

    // setLoading(false);

    return () => {
      socket.current.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  useEffect(() => {
    if (response && (response?.data || response?.file)) {
      setMessages((prev) => [...prev, response]);
    }
  }, [response]);

  const handleInput = (e) => {
    const textarea = textarearef.current;
    textarea.style.height = "auto"; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to content height
  };

  function sendMessage(e) {
    e.preventDefault();
    if (!socket.current) return;
    socket.current.emit("message", {
      roomId: code,
      data: message,
      by: me,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setMessage("");
    textarearef.current.style.height = "auto";
  }

  function cancelUpload(e) {
    e.preventDefault();
    setUploadingFiles([]);
    console.log('Closed');
    
    fileUploadRef.current.close();
  }

  function handleFileUploads(e) {
    fileUploadRef.current.showModal();
    const file = Array.from(e.target.files);
    const filtered = file.filter((f) => f.size <= 5 * 1024 * 1024).slice(0, 10);
    setUploadingFiles((prev) => [...prev, ...filtered]);
  }

  async function handleSendFiles() {
    setFileUploading(true);

    let formdata = new FormData();

    uploadingFiles.forEach((f) => {
      formdata.append("Userfiles", f);
    });

    formdata.append("roomId", code);
    formdata.append("by", me);
    formdata.append(
      "time",
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/file`,
        formdata
      );

      console.log(result.data);
      setUploadingFiles([]);
    } catch (e) {
      console.error(e);
    }

    fileUploadRef.current.close();
    setFileUploading(false);
  }

  return (
    <div >
      <dialog
        ref={dialogRef}
        style={{
          border: "none",
          fontFamily: "'Quicksand', sans-serif ",
          fontWeight: 600,
          color: "#4a4a4a",
        }}
      >
        <p>Set Your Username</p>
        <input
          autoComplete="off"
          placeholder="Enter here a username"
          required
          value={user}
          onChange={(e) => setUser(e.target.value)}
        ></input>
        <button
          className="sublink"
          disabled={!userNameEntered}
          onClick={handleUsernameSubmission}
        >
          Enter room
        </button>
      </dialog>

      <dialog
        ref={fileUploadRef}
        style={{
          maxWidth: "calc(100% - 10rem)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          border:"0px",
          borderRadius:"20px"
        }}
      >
        <button className="sublink" onClick={handleSendFiles}>
          {fileUploading ? "sending..." : "send"}
        </button>
        <button className="sublink"  onClick={cancelUpload}>
          Cancel
        </button>
        <ul
          style={{
            maxHeight: "calc(100% - 10rem)",
            width: "100%",
            overflowY: "scroll",
          }}
        >
          {uploadingFiles &&
            uploadingFiles.map((file, idx) => (
              <li key={idx}>
                <FilePreview file={file} />
              </li>
            ))}
        </ul>
      </dialog>

      {state==="loading" ? (
        <div>Loading....</div>
      ) : state==="ready" ? (
        <div>
          <div className="body">
            <nav>
              <Name />

              <section className="room-details">
                <p>
                  Live users <span>{users}</span>
                </p>
                <p>
                  Room code <span>{code}</span>
                </p>
              </section>
            </nav>

            <section className="messages">
              {messages.map((chat, idx) => (
                <ChatCard
                  key={"messages-" + idx}
                  data={chat?.data}
                  by={chat.by}
                  time={chat.time}
                  file={chat?.file || false}
                  filename={chat?.filename}
                />
              ))}
            </section>
          </div>
          <form className="send-msg">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              onInput={handleInput}
              placeholder="Enter message"
              ref={textarearef}
            ></textarea>

            <label
              id="label-for-file"
              htmlFor="file-upload"
              title="Upload file"
            >
              <img src={uploadPng} alt="uploadfile" />
            </label>

            <button onClick={sendMessage}><img src={sendPng} alt="sendMessage" /></button>
            <input
              id="file-upload"
              style={{ display: "none" }}
              type="file"
              multiple
              onChange={handleFileUploads}
            ></input>
          </form>
        </div>
      ) : (
        <div>Sorry Error occured retry...</div>
      )}
    </div>
  );
}

export default Chat;
