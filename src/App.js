import "./styles.css";
import { useEffect, useRef, useState } from "react";

export default function App() {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const textRef = useRef();
  const pc = useRef();

  useEffect(() => {
    const pc_config = null;

    pc.current = new RTCPeerConnection(pc_config);

    pc.current.onicecandidate = (e) => {
      if (e.candidate) console.log(JSON.stringify(e.candidate));
    };

    pc.current.onicegatheringstatechange = (e) => console.log(e);

    pc.current.ontrack = (e) => {
      remoteVideoRef.current.srcObject = e.streams[0];
    };

    const constraints = { video: true };
    const success = (stream) => {
      localVideoRef.current.srcObject = stream;
    };
    const failure = (e) => console.log("failed", e);

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  }, []);

  const createOffer = () => {
    console.log("Offer");
    pc.current.createOffer({ offerToRecieveVideo: 1 }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        pc.current.setLocalDescription(sdp);
      },
      (e) => {}
    );
  };

  const createAnswer = () => {
    console.log("Offer");
    pc.current.createAnswer({ offerToRecieveVideo: 1 }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        pc.current.setLocalDescription(sdp);
      },
      (e) => {}
    );
  };

  const setRemoteDescription = () => {
    const desc = JSON.parse(textRef.current.value);
    pc.current.setRemoteDescription(new RTCSessionDescription(desc));
  };

  const addCandidate = () => {
    const candidate = JSON.parse(textRef.current.value);
    console.log("Adding ice candidate");

    pc.current.addCandidate(new RTCIceCandidate(candidate));
  };

  return (
    <div className="App">
      <video autoPlay ref={localVideoRef}></video>
      <video
        style={{ border: "2x solid red" }}
        autoPlay
        ref={remoteVideoRef}
      ></video>
      <button onClick={createOffer}>Create Offer</button>
      <button onClick={createAnswer}>Create Answer</button>
      <textarea ref={textRef} />
      <button onClick={setRemoteDescription}>Add Ice Candidate</button>
      <button onClick={addCandidate}>Set Remote Desc</button>
    </div>
  );
}
