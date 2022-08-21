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
    } else {
      const room_id = window.location.pathname;
      socket.emit("reciever", room_id.substring(1, room_id.length - 1), mine);
    }
  }, []);
  socket.on("joined", (currentRoom) => {
    navigate(`/join=${currentRoom}`);
  });
  // socket.on("participants", (args) => {
  //   // console.log(args);
  //   args.map((item: participantsProp, index: number) => {
  //     if (item.id !== my_id) {
  //       // console.log(item);
  //       // addVideoStream(item.videoStream);
  //     }
  //   });
  // });
  myPeer.on("open", (id) => {
    // socket.emit("join-room", ROOM_ID, id);
  });
  // socket.emit("join-room", ROOM_ID, 10);

  //   const connectToNewUser = (userId: string, stream: MediaStream) => {
  //     const call = myPeer.call(userId, stream);
  //     const video = document.createElement("video");

  //     call.on("stream", (userVideoStream) => {
  //       addVideoStream(userVideoStream);
  //     });

  //     call.on("close", () => {
  //       video.remove();
  //     });
  //   };

  const addVideoStream = (stream: MediaStream) => {
    console.log(stream);
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
