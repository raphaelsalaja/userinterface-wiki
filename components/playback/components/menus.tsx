"use client";

import React from "react";
import type { SettingsMenuProps, VolumeControlProps } from "../playback.types";
import { SettingsMenuView, VolumeControlView } from "./menus.view";

export const VolumeControl = (props: VolumeControlProps) => (
  <VolumeControlView {...props} />
);

export const SettingsMenu = ({
  onCopyTimestamp,
  ...props
}: SettingsMenuProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyTimestamp = React.useCallback(() => {
    onCopyTimestamp();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [onCopyTimestamp]);

  return (
    <SettingsMenuView
      {...props}
      copied={copied}
      onCopyClick={handleCopyTimestamp}
    />
  );
};
