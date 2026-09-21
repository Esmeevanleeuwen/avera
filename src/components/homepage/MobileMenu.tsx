"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "@/app/page.module.css";

const links = [
  ["#stories", "Stories"],
  ["#voices", "Voices"],
  ["#investigations", "Investigations"],
  ["#artikelen", "Artikelen"],
  ["#data", "Data"],
  ["#world", "World"],
  ["#about", "About"],
  ["#share", "Anoniem deelnemen"],
] as const;

export default function MobileMenu() {
  const details = useRef<HTMLDetailsElement>(null);
  const summary = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function close(returnFocus = false) {
      if (!details.current?.open) return;
      details.current.open = false;
      if (returnFocus) summary.current?.focus();
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && details.current?.open) {
        event.preventDefault();
        close(true);
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !details.current?.contains(event.target)) close();
    }
    const desktop = window.matchMedia("(min-width: 1025px)");
    const onResize = () => { if (desktop.matches) close(); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onResize);
    };
  }, []);

  return (
    <details ref={details} className={styles.mobileMenu} onToggle={event => setOpen(event.currentTarget.open)}>
      <summary ref={summary} aria-label={open ? "Navigatie sluiten" : "Open navigatie"} aria-controls="mobile-homepage-navigation">
        {open ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
      </summary>
      <nav id="mobile-homepage-navigation" aria-label="Mobiele navigatie" onClick={event => {
        if (event.target instanceof Element && event.target.closest("a") && details.current) details.current.open = false;
      }}>
        {links.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
      </nav>
    </details>
  );
}
