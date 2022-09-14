import PreCall from "./components/pages/preCall";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import ViewArea from "./components/pages/viewArea";
import { useRef } from "react";
function App() {
  const people = [
    "deba",
    "ayo",
    "ngozi",
    "joel",
    "david",
    "joshua",
    "demola",
    "dami",
    "joella",
  ];
  const officers = useRef(require("./components/data.json"));
  const getId = (name: string) => {
    const obj = officers.current.find((item: any) => item.name === name);
    return obj === undefined ? "not found" : obj.officeId;
  };
  const mine = getId(people[Math.floor(Math.random() * 9)]);
  return (
    <>
      <Routes>
        <Route path="/" element={<PreCall mine={mine} />} />
        <Route path={`/join=:room`} element={<ViewArea mine={mine} />} />
      </Routes>
    </>
  );
}

export default App;
