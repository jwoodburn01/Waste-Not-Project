import Profile from "../images/logo.png";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

function ChatContainer({ currentChatUser }) {
  // initializing the variables at the start
  const [message, setMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();
  const socket = useRef();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // this useEffect retrieves the messages from the logged in user and the selected user
  useEffect(() => {
    axios
      .get(
        `http://localhost:3001/get/chat/msg/${userInfo._id}/${currentChatUser._id}`
      )
      .then((message) => {
        setMessage(message.data);
      })
      .catch((error) => console.error(error));
  }, [currentChatUser]);

  useEffect(() => {
    if (currentChatUser !== "") {
      socket.current = io("http://localhost:3001");
      socket.current.emit("addUser", userInfo._id);
    }
  }, [userInfo._id]);
  console.log(socket);

  // this brings the user to the botom of the list of messages, to the most recent one
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);

  // this method takes the message the user has inserted and adds it to the messages section of the database using the to and from to let if display
  const sendMessage = () => {
    const messages = {
      myself: true,
      message: inputMessage,
    };
    socket.current.emit("send-msg", {
      from: userInfo._id,
      to: currentChatUser._id,
      message: inputMessage,
    });

    axios.post("http://localhost:3001/msg", {
      from: userInfo._id,
      to: currentChatUser._id,
      message: inputMessage,
    });
    setMessage(message.concat(messages));

    setInputMessage("");
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log(msg);
        setArrivalMessage({
          myself: false,
          message: msg,
        });
      });
    }
  }, [arrivalMessage]);

  useEffect(() => {
    arrivalMessage && setMessage((pre) => [...pre, arrivalMessage]);
  }, [arrivalMessage]);

  // this return statement shows the messaged the user has got and allows them to send ones as well.
  return (
    <div className="mainChatContainer">
      <div>
        <div
          style={{
            display: "flex",
            marginLeft: "30px",
            marginTop: "10px",
            backgroundColor: "gray",
            padding: "10px",
            borderRadius: "10px",
          }}
        >
          <img
            src={currentChatUser?.pic}
            alt="user profile image"
            className="userProfileImage"
          />
          <p style={{ marginTop: "10px", marginLeft: "10px" }}>
            {currentChatUser?.fName + " " + currentChatUser?.lName}
          </p>
        </div>
        <div className="chatMsgContainer">
          {message?.map((msg) => (
            <div ref={scrollRef}>
              {msg.myself === false ? (
                <div className="msg">
                  <img
                    src={currentChatUser.pic}
                    alt="user profile image"
                    className="chatProfileImage"
                  />
                  <p className="msgText">{msg?.message}</p>
                </div>
              ) : (
                <div className="msgReply">
                  <p className="msgText">{msg?.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="msgSendContainer">
          <input
            type="text"
            className="msgInput"
            placeholder="Write a message..."
            onChange={(e) => setInputMessage(e.target.value)}
            value={inputMessage}
          />
          <button className="sendButton" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
