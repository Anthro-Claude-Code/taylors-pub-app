"use client";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export function QrCode({ value, size = 200 }: { value: string; size?: number }) {
  const [svg, setSvg] = useState<string>("");
  useEffect(() => {
    let cancelled = false;
    QRCode.toString(value, {
      type: "svg",
      margin: 0,
      width: size,
      color: { dark: "#0f2419", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then((s) => {
        if (!cancelled) setSvg(s);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [value, size]);
  if (!svg) return <div className="qr-frame rounded-xl flex items-center justify-center" style={{ width: size, height: size }} />;
  return (
    <div
      className="qr-frame rounded-xl p-3 inline-block"
      style={{ width: size + 24, height: size + 24 }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
