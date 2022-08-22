import React, { useEffect, useRef, useState } from "react";
import "../callerPage.scss";
import { Peer } from "peerjs";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("ws://localhost:4000");

const CallerPage = ({ mine }: { mine: string }) => {
  const navigate = useNavigate();

  const myPeer = new Peer(mine, {
    host: "/",
    port: 3001,
  });
  const [my_id, setMy_id] = useState(Math.floor(Math.random() * 100));

  const ROOM_ID = useRef();

  useEffect(() => {
    console.log(window.location.pathname);
    if (window.location.pathname === "/") {
      socket.emit("caller", mine);
    } 
  }, []);
  socket.on("join", (currentRoom) => {
    navigate(`/join=${currentRoom}`);
  });
  myPeer.on("open", (id) => {});
  const addVideoStream = (stream: MediaStream) => {
    // console.log(stream);
    const videos_box: HTMLDivElement = document.querySelector(
      ".videos .otherUsers"
    )!;
    const video_elem = document.createElement("video");
    video_elem.pause();
    video_elem.muted = true;
    video_elem.srcObject = stream;
    video_elem.addEventListener("loadedmetadata", () => {
      video_elem.play();
    });
    videos_box.append(video_elem);
  };

  return <></>;
};

export default CallerPage;
