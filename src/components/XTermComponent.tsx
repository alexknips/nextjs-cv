import { OpenAiRequestData } from "@/app/api/openai/route";
import React, { useEffect, useRef, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

interface VoiceSettings {
  similarity_boost: number;
  stability: number;
  use_speaker_boost: boolean;
}

interface RequestData {
  model_id: string;
  text: string;
  voice_settings: VoiceSettings;
}


interface XTermComponentProps {}

const XTermComponent: React.FC<XTermComponentProps> = ({}) => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [openAiInProgress, setOpenAiInProgress] = useState(false);
 
  const loadAudio = async (options: any) => {
    try {
      const response = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/ePQGCqByrc8Krl24cTQf",
        options
      );
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      // TypeScript now knows audioRef.current is an HTMLAudioElement
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error loading audio:", error);
    }
  };

  useEffect(()=> {

  }, [openAiInProgress]);

  const terminal = new Terminal({
    cursorBlink: true,
    fontSize: 16,
    fontFamily: '"Fira Code", monospace',
    theme: {
      background: "#272822", // Monokai background color
      foreground: "#f8f8f2", // Monokai main text color
      cursor: "#f8f8f0", // Cursor color
      black: "#272822",
      red: "#f92672", // Bright Red
      green: "#a6e22e", // Bright Green
      yellow: "#f4bf75", // Bright Yellow
      blue: "#66d9ef", // Bright Blue
      magenta: "#ae81ff", // Bright Magenta
      cyan: "#a1efe4", // Bright Cyan
      white: "#f9f8f5", // Bright White
      brightBlack: "#75715e",
      brightRed: "#fd971f", // Soft Orange
      brightGreen: "#383830",
      brightYellow: "#49483e",
      brightBlue: "#a59f85",
      brightMagenta: "#f5f4f1",
      brightCyan: "#cc6633", // Soft Brown
      brightWhite: "#f8f8f2",
    },
  });

  useEffect(() => {
    let currentLine = "";
    let inProgress = false;
    function handleInput(data: string | Uint8Array) {
      // Check for Enter key
      if (data === "\r") {
        // Process the input when Enter is pressed
        processInput(currentLine);
        currentLine = ""; // Reset the input buffer
      } else if (data === "\x7f" || data === "\b") {
        // Handle backspace
        if (currentLine.length > 0) {
          // Remove the last character from the input buffer
          currentLine = currentLine.substring(0, currentLine.length - 1);
          // Move the cursor back one space, print a space (to clear the character), and move back again
          terminal.write("\b \b");
        }
      } else {
        currentLine += data; // Accumulate the input
        terminal.write(data); // Echo the input character
      }
    }

    async function processInput(input: string) {
      // Process the input line (add your logic here)
      terminal.writeln("");
      console.log("User entered:", input);
      const data = { question: input };
      // Make a request to your API route
      const resP = fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify(data),
      });
      inProgress = true;
      const res = await resP;
      inProgress = false;
      const jsonRes = await res.json();
      console.log(JSON.stringify(jsonRes));
      const answer = jsonRes.message;
      terminal.writeln(answer);
      console.log("Assistant responds:", answer);
      // const requestData: RequestData = {
      //   model_id: "eleven_turbo_v2",
      //   text: answer,
      //   voice_settings: {
      //     similarity_boost: 0.5,
      //     stability: 0.5,
      //     use_speaker_boost: true,
      //   },
      // };
      // const jsonBody = JSON.stringify(requestData);
      // const options = {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "xi-api-key": "2ff5de2f5ba4ba7b1f9b51d1259a67a0",
      //     Accept: "audio/mpeg",
      //   },
      //   body: jsonBody,
      // };
      // loadAudio(options);
    }

    if (terminalRef.current) {
      terminal.open(terminalRef.current);

      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      // Make the terminal's size and geometry fit the size of #terminal-container
      fitAddon.fit();
      const webLinksAddon = new WebLinksAddon();
      terminal.loadAddon(webLinksAddon);
    }

    terminal.onData(handleInput);

    terminal.writeln("Welcome to my personal profile.");
    terminal.writeln(
      "You can download a PDF version of the CV through clicking on the following link: https://www.example.com"
    );
    terminal.writeln(
      "Please try using the keyboard only to navigate and interact with me."
    );

    return () => {
      terminal.dispose();
    };
  }, []);

  return (
    <div className="h-full w-full" ref={terminalRef}>
      <audio
        ref={audioRef}
        controls
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          margin: "-1px",
          padding: "0",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          border: "0",
        }}
      />
    </div>
  );
};

export default XTermComponent;
