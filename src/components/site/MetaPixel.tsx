"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, trackPixel } from "@/lib/metaPixel";

export function MetaPixel() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  // O script base já dispara o PageView da primeira página; aqui contamos as navegações seguintes.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    trackPixel("PageView");
  }, [pathname]);

  // Qualquer clique em link do WhatsApp (botão flutuante, menu, rodapé) conta como Contato.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      if (link && /wa\.me|whatsapp\.com/.test(link.getAttribute("href") ?? "")) {
        trackPixel("Contact");
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
