"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** הודעה קצרה בתחתית המסך. role=status כדי שקורא מסך יקריא אותה */
export function useToast() {
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const show = useCallback((m: string) => {
    setMsg(m);
    setOpen(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 2400);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  const node = (
    <div className={"toast" + (open ? " show" : "")} role="status" aria-live="polite">
      {msg}
    </div>
  );
  return { show, node };
}
