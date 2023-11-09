"use client";
import { useEffect } from "react";

export default function Page() {
  useEffect(() => {
    (async () => {
      console.log("sending request to", process.env.BACKEND_URL);
      const res = await fetch(process.env.BACKEND_URL as string);
      const body = await res.json();
      console.log(body);
    })();

    // const ws = new WebSocket(process.env.BACKEND_URL as string);

    // ws.onopen = () => {
    //   console.log("**ON OPEN");
    //   ws.send("This is coming from the client!");
    // };
  }, []);

  return (
    <>
      <h1>Testing bun backend</h1>
    </>
  );
}
