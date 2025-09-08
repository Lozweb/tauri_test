import {useEffect, useState} from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

export function App() {
    const [greetMsg, setGreetMsg] = useState("");
    const [name, setName] = useState("");

    const [mem, setMem] = useState<number | null>(null);

    async function getMemoryUsage() {
        try {
            const value = await invoke<number | null>("total_mem");
            setMem(value);
        } catch (e) {
            console.error(e);
        }
    }

    async function greet() {
        // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
        setGreetMsg(await invoke("greet", {name}));
    }

    useEffect(() => {
        getMemoryUsage();
        const interval = setInterval(getMemoryUsage, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className="container">
            <h1>Total RAM</h1>
            <p>{<p>{mem !== null ? (mem / (1024 ** 3)).toFixed(2) + " Go" : ""}</p>}</p>

            <form
                className="row"
                onSubmit={(e) => {
                    e.preventDefault();
                    greet();
                }}
            >
                <input
                    id="greet-input"
                    onChange={(e) => setName(e.currentTarget.value)}
                    placeholder="Enter a name..."
                />
                <button type="submit">Greet</button>
            </form>
            <p>{greetMsg}</p>
        </main>
    );
}

