import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import mic from "../images/icons8-microphone-60.png";
import end_call from "../images/icons8-end-call-48.png";
import video_icon from "../images/icons8-video-call-48.png";
import { Peer } from "peerjs";

const socket = io("ws://localhost:4000");
const ViewArea = ({ mine }: { mine: string }) => {
  const [input, setInput] = useState("");
  //
  const peer = new Peer(mine);
  // , {
  //   host: "/",
  //   port: 3001,
  // }
  // const conn = peer.connect("another-peers-id");
  // conn.on("open", () => {
  //   conn.send("hi!");
  // });

  const my_video = useRef<HTMLVideoElement>(null);
  // const [on, setOn] = usestate(false)
  // const [input, setInput] = useState("");
  const ROOM_ID = useRef("");
  useEffect(() => {
    const room_id = window.location.pathname.substring(6);
    console.log(my_video);
    ROOM_ID.current = room_id;
    console.log(room_id, mine, "reload?");
    if (room_id !== mine) {
      socket.emit("reciever", room_id, mine);
      console.log("here");
    } else {
      socket.emit("caller-view", mine, mine);
      // navigator.mediaDevices
      //   .getUserMedia({
      //     video: true,
      //     audio: true,
      //   })
      //   .then((stream) => {
      //     const my_video: HTMLVideoElement = document.querySelector("#mine")!;
      //     my_video.muted = true;
      //     my_video.pause();
      //     my_video.srcObject = stream;
      //     my_video.addEventListener("loadedmetadata", () => {
      //       my_video.play();
      //     });

      //     const call = peer.call("tbs1888cv ", stream);
      //     call.on("stream", (remoteStream) => {
      //       console.log(remoteStream);
      //       // Show stream in some <video> element.
      //     });
      //   });
    }
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        const my_video: HTMLVideoElement = document.querySelector("#mine")!;
        my_video.muted = true;
        my_video.pause();
        my_video.srcObject = stream;
        my_video.addEventListener("loadedmetadata", () => {
          my_video.play();
        });

        const call = peer.call("tbs1888cv ", stream);
        call.on("stream", (remoteStream) => {
          console.log(remoteStream);
          // Show stream in some <video> element.
        });

        // socket.emit("my_videoStream", { id: my_id, videoStream: stream });
        // myPeer.on("call", (call) => {
        //   //????
        //   call.answer(stream);
        // });
      });
  }, []);
  peer.on("connection", (conn) => {
    console.log("data");
    conn.on("data", (data) => {
      // Will print 'hi!'
      console.log(data);
    });
    conn.on("open", () => {
      conn.send("hello!");
    });
  });
  peer.on("call", (call) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        call.answer(stream); // Answer the call with an A/V stream.
        call.on("stream", (remoteStream) => {
          console.log(remoteStream, "answer ish");
          // Show stream in some <video> element.
        });
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
  });

  socket.on("new-msg", (input, name, id) => {
    console.log(name, ": ", input);

    const msg_list = document.querySelector(".msg-area ul");

    const li = document.createElement("li");
    const div = document.createElement("div");
    const p1 = document.createElement("p");
    const p2 = document.createElement("p");
    li.setAttribute("class", id === mine ? "mine" : "others");
    p1.innerText = name;
    p2.innerText = input;
    msg_list?.appendChild(li);
    li.appendChild(div);
    div.appendChild(p1);
    div.appendChild(p2);
  });

  socket.on("no-exist", () => {
    console.log("room does not exist");
  });
  socket.on("in-call", (args) => {
    console.log(args);
  });
  const cancel = (selector: "mic-img" | "vid-img") => {
    const my_vid: HTMLVideoElement = document.querySelector("#mine")!;
    const element = document.querySelector(`.${selector}`)!;
    console.log();
    if (selector === "vid-img") {
      console.log("vid");
      // my_vid.pause();
    }
    if (selector === "mic-img") {
      if (my_vid.muted) {
        my_vid.muted = false;
        element.setAttribute("class", selector);
      } else {
        my_vid.muted = true;
        element.setAttribute("class", `${selector} false`);
      }
    }
  };
  return (
    <>
      <header></header>
      <main>
        <section className="video-area">
          <div className="videos">
            <video src="" id="mine" ref={my_video}></video>
            {/* <div className="otherUsers"></div> */}
          </div>
          <div className="controls">
            <div className="vid-img" onClick={() => cancel("vid-img")}>
              <img src={video_icon} alt="" />
            </div>
            <div className={`mic-img false`} onClick={() => cancel("mic-img")}>
              <img src={mic} className="mic false" alt="" />
            </div>
            <div className="end-call">
              <img src={end_call} alt="" />
            </div>
          </div>
        </section>
        <section className="chat-area">
          <h2>Messages</h2>
          <div className="msg-area">
            <ul>
              <li className="others">
                <div>
                  <p>debs</p>
                  <p>message content lol</p>
                </div>
              </li>
              <li className="mine">
                <div>
                  <p>debs</p>
                  <p>message content lol</p>
                </div>
              </li>
            </ul>
          </div>
          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              socket.emit("msg", input, ROOM_ID.current, mine);
              setInput("");
            }}
          >
            <input
              type="text"
              name=""
              id=""
              value={input}
              onChange={(e) => {
                setInput(e.target.value.trim());
              }}
            />
            <button>submit</button>
          </form>
        </section>
      </main>
      <footer></footer>
    </>
  );
};

export default ViewArea;
