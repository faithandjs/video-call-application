import React, { useEffect } from "react";
import { io } from "socket.io-client";
const socket = io("ws://localhost:4000");

const ViewArea = ({ mine }: { mine: string }) => {
  useEffect(() => {
// socket.emit('')

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
