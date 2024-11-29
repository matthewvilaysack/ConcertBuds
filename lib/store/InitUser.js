"use client";
import React, { useEffect, useRef } from "react";
import { useUser } from "./user";

export default function InitUser({ user }) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      useUser.setState({ user });
    }
    initState.current = true;
  }, [user]);

  return null;
}
