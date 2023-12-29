import { Show } from "@/app/models";
import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebLinksAddon } from "xterm-addon-web-links";
import "xterm/css/xterm.css";

interface XTermComponentProps {
  showOrHideVisuals: (show: Show, visible: boolean) => void;
  onProgressChanged: (inProgress: boolean) => void;
}

const XTermComponent: React.FC<XTermComponentProps> = ({
  showOrHideVisuals: onCustomFunction,
  onProgressChanged,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);

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

    function handleInput(data: string | Uint8Array) {
      // Check for Enter key

      if (data === "\x1b") {
        console.log("Escape key pressed");
        onCustomFunction(Show.All, false);
        currentLine = ""; // Reset the input buffer
      } else if (data === "\r") {
        // Process the input when Enter is pressed
        processInput(currentLine).then(() => {
          terminal.write("$ ");
          currentLine = ""; // Reset the input buffer
        });
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
      switch (input.toLowerCase().trim()) {
        case "man resume":
          helpMessage(terminal);
          break;
        case "help":
          helpMessage(terminal);
          break;
        case "pdf":
          helpMessage(terminal);
          break;
        case "welcome":
          welcomeMessage(terminal);
          break;
        case "employment":
          onCustomFunction(Show.Employment, true);
          terminal.writeln(
            "\x1b[33m⚙️ \x1b[3mShowing Employment history visually\x1b[23m\x1b[0m"
          );
          break;
        case "hide":
          onCustomFunction(Show.All, false);
          break;
        case "education":
          onCustomFunction(Show.Education, true);
          terminal.writeln(
            "\x1b[33m⚙️ \x1b[3mShowing Employment history visually\x1b[23m\x1b[0m"
          );
          break;
        case "download":
          terminal.writeln(
            "\x1b[33m⚙️ \x1b[3mDownload the resume by clicking on the following link: \x1b]8;;https://drive.google.com/file/d/1bjqtvsl-OJMlZPKiiyvJxekK5HjLRip1/view?usp=sharing\x07Link to Google Drive\x1b]8;;\x07 or https://drive.google.com/file/d/1bjqtvsl-OJMlZPKiiyvJxekK5HjLRip1/view?usp=sharing\x1b[23m\x1b[0m"
          );
          break;
        case "exit":
          terminal.writeln(
            "\x1b[33m⚙️ \x1b[3mExiting this site and jumping to my blog.\x1b[23m\x1b[0m"
          );
          window.location.href = "https://medium.com/@alexanderknips";
          break;
        default:
          if (input.length > 3) await communicateWithAi(input);
          else
            terminal.writeln(
              "\x1b[33m⚙️ \x1b[3mInput too short for AI to answer\x1b[23m\x1b[0m"
            );
          break;
      }
    }

    function welcomeMessage(terminal: Terminal) {
      terminal.writeln(
        "\x1b[33m⚙️ \x1b[3mThis is a fake terminal. Please interact with it as if it was real terminal but also a chatbot. Use the Esc key to hide elements. Use man or help to get more help.\x1b[23m\x1b[0m"
      );
    }

    function helpMessage(terminal: Terminal) {
      terminal.writeln("\x1b[3;32mAlexander Knips' resume\x1b[23m\x1b[0m");
      terminal.writeln("");
      terminal.writeln("\x1b[3;32mDESCRIPTION\x1b[23m\x1b[0m");
      terminal.writeln(
        "    \x1b[3;32mThis is not a real terminal but some simple commands work.\x1b[23m\x1b[0m"
      );
      terminal.writeln(
        "    \x1b[1;31meducation\x1b[0m\x1b[3;32m    Show the education history visually"
      );
      terminal.writeln(
        "    \x1b[1;31memployment\x1b[0m\x1b[3;32m   Show the employment history visually"
      );
      terminal.writeln(
        "    \x1b[1;31mdownload\x1b[0m\x1b[3;32m     Show the employment history visually"
      );
      terminal.writeln(
        "    \x1b[1;31mhelp\x1b[0m\x1b[3;32m         Bring this help page up again"
      );
      terminal.writeln(
        "    \x1b[1;31mman resume\x1b[0m\x1b[3;32m   Bring this help page up again"
      );
      terminal.writeln(
        "    \x1b[1;31mexit\x1b[0m\x1b[3;32m         Exit this terminal"
      );

      terminal.writeln("");
      terminal.writeln(
        "    \x1b[3;32mAll other commands longer than 3 characters will be answered \x1b[23m\x1b[0m"
      );
      terminal.writeln(
        "    \x1b[3;32mby a custom GPT-powered assistant\x1b[23m\x1b[0m"
      );
      terminal.writeln(
        "    \x1b[3;32mthat is trained on Alexander Knips' resume data.\x1b[23m\x1b[0m"
      );
      terminal.writeln("");
      terminal.writeln("    \x1b[3;32mTry questions such as:\x1b[23m\x1b[0m");
      terminal.writeln("");
      terminal.writeln(
        "    \x1b[1;31mTell me about Alexander's experience in Software Engineering.'\x1b[23m\x1b[0m"
      );
      terminal.writeln(
        "    \x1b[1;31mWhat was Alexander's last position?'\x1b[0m.\x1b[23m\x1b[0m"
      );
      terminal.writeln(
        "    \x1b[1;31mWhat is Alexander's highest education?\x1b[0m'\x1b[23m\x1b[0m"
      );
      terminal.writeln(
        "    \x1b[1;31mWhat are Alex' qualifications as a lead engineer?\x1b[0m'.\x1b[23m\x1b[0m"
      );
    }

    async function communicateWithAi(input: string) {
      const data = { question: input };
      // Make a request to your API route
      const resP = fetch("/api/openai", {
        method: "POST",
        body: JSON.stringify(data),
      });
      onProgressChanged(true);
      try {
        const res = await resP;
        onProgressChanged(false);
        const jsonRes = await res.json();
        console.log(JSON.stringify(jsonRes));
        const answer = jsonRes.message;

        terminal.writeln("\x1b[32m🤖 \x1b[3m" + answer + "\x1b[23m\x1b[0m");
        terminal.writeln("");
        console.log("Assistant responds:", answer);
      } catch {
        terminal.writeln(
          "\x1b[32m🤖 \x1b[3m Failed to answer this question. Try to ask differently.\x1b[23m\x1b[0m"
        );
      }
    }

    if (terminalRef.current) {
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      const webLinksAddon = new WebLinksAddon();
      terminal.loadAddon(webLinksAddon);

      terminal.open(terminalRef.current);

      fitAddon.fit();

      let resizeTimeout: string | number | NodeJS.Timeout | undefined;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          console.log("Refitting");
          fitAddon.fit();
        }, 100); // Adjust the timeout duration as needed
      });
    }

    terminal.onData(handleInput);

    welcomeMessage(terminal);
    terminal.write("$ ");

    return () => {
      terminal.dispose();
    };
  }, []);

  return <div className="h-full w-full" ref={terminalRef} />;
};

export default XTermComponent;
