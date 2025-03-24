import React from "react";


export default function HandleName(e: React.FormEvent, name: string) {
    e.preventDefault();
    localStorage.setItem("name", name);
}