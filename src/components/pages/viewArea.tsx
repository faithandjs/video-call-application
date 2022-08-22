import React, { useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("ws://localhost:4000");

const ViewArea = ({ mine }: { mine: string }) => {
  useEffect(() => {
    const room_id = window.location.pathname.substring(6);
    console.log(room_id, mine, "reload?");
    if (room_id !== mine) {
      socket.emit("reciever", room_id, mine);
      console.log("here");
    } else {
      socket.emit("caller-view", mine, mine);
    }
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // console.log(stream);
        const my_video: HTMLVideoElement = document.querySelector("#mine")!;
        my_video.muted = true;
        my_video.pause();
        my_video.srcObject = stream;
        my_video.addEventListener("loadedmetadata", () => {
          my_video.play();
        });
        // socket.emit("my_videoStream", { id: my_id, videoStream: stream });
        // myPeer.on("call", (call) => {
        //   //????
        //   call.answer(stream);
        // });
      });
  }, []);
  socket.on("no-exist", () => {
    console.log("room does not exist");
  });
  socket.on("in-call", (args) => {
    console.log(args);
  });
  return (
    <>
      <header></header>
      <div className="video-screen">
        <div className="videos">
          <video src="" id="mine"></video>
          <div className="otherUsers"></div>
        </div>
        <div className="controls"></div>
      </div>
      <footer></footer>
    </>
  );
};

export default ViewArea;
