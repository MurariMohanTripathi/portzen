import { useEffect, useState } from "react";
import { checkUsernameAvailability } from "../services/portfolioService";
import useDebouncedValue from "./useDebouncedValue";
import { validateUsername } from "../utils/username";

export default function useUsernameAvailability(username, currentUid) {
  const debounced = useDebouncedValue(username);
  const [state, setState] = useState({ status: "idle", message: "" });

  useEffect(() => {
    let active = true;
    const validation = validateUsername(debounced);
    if (!debounced) {
      queueMicrotask(() => setState({ status: "idle", message: "" }));
      return undefined;
    }
    if (!validation.ok) {
      queueMicrotask(() => setState({ status: "invalid", message: validation.reason }));
      return undefined;
    }

    queueMicrotask(() => setState({ status: "checking", message: "checking..." }));
    checkUsernameAvailability(validation.username, currentUid)
      .then((available) => {
        if (!active) return;
        setState(available
          ? { status: "available", message: "available" }
          : { status: "taken", message: "already taken" });
      })
      .catch(() => {
        if (active) setState({ status: "unknown", message: "availability check unavailable" });
      });

    return () => {
      active = false;
    };
  }, [debounced, currentUid]);

  return state;
}
