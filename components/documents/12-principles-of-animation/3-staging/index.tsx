"use client";

import { Dialog } from "@base-ui/react/dialog";
import type { Variants } from "motion/react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Bell2Icon,
  DotGrid1X3HorizontalIcon,
  SquareBehindSquare2Icon,
} from "@/icons";
import styles from "./styles.module.css";

interface Wallet {
  id: string;
  name: string;
  balance: number;
  address: string;
  color: string;
}

const COLORS = [
  "--family-redPink",
  "--family-pink",
  "--family-purple",
  "--family-darkPurple",
  "--family-bluePurple",
  "--family-darkBlue",
  "--family-seaBlue",
  "--family-blue",
  "--family-emerald",
  "--family-grassGreen",
  "--family-green",
  "--family-lime",
  "--family-offYellow",
  "--family-orange",
  "--family-burntOrange",
  "--family-red",
  "--family-yellowBrown",
  "--family-copper",
  "--family-navy",
  "--family-black",
] as const;

const LAYOUT_ID = {
  wallet: "wallet",
  topTrailing: "top-trailing",
  bottomTrailing: "bottom-trailing",
  topLeading: "top-leading",
  bottomLeading: "bottom-leading",
} as const;

const VARIANTS = {
  blur: {
    hidden: { filter: "blur(10px)" },
    visible: { filter: "blur(0px)" },
  },
  picker: {
    hidden: {
      opacity: 0,
      translateY: 32,
      filter: "blur(12px)",
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      translateY: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      translateY: 32,
      scale: 0,
      filter: "blur(12px)",
      transition: { duration: 0.2 },
    },
  },
} as const satisfies Record<string, Variants>;

export function Staging() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [wallet, setWallet] = useState<Wallet>({
    id: "1",
    name: "Raphael",
    balance: 57_206,
    address: "0x1234567890abcdef1234567890abcdef12345678",
    color: COLORS[10],
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isPickingColor, setIsPickingColor] = useState(false);

  const bg = `var(${wallet.color})`;

  const label = !isOpen
    ? ""
    : isEditingName
      ? "Done"
      : isPickingColor
        ? "Edit Nickname"
        : "Customize";

  function copyAddress() {
    navigator.clipboard.writeText(wallet.address);
  }

  function handleNameChange(name: string) {
    setWallet((w) => ({ ...w, name }));
  }

  function finishNameEdit() {
    setIsEditingName(false);
    setIsPickingColor(false);

    if (!wallet.name.trim()) {
      setWallet((w) => ({ ...w, name: "New Wallet" }));
    }
  }

  function handleCustomizeClick() {
    if (isEditingName) {
      finishNameEdit();
      return;
    }

    if (isPickingColor) {
      setIsPickingColor(false);
      setIsEditingName(true);
      return;
    }

    setIsPickingColor(true);
  }

  function handleSaveColors() {
    setIsPickingColor(false);
  }

  function handleDialogChange(open: boolean) {
    if (open) {
      setIsOpen(true);
    } else {
      setIsEditingName(false);
      setIsPickingColor(false);
      setTimeout(() => setIsOpen(false), 200);
    }
  }

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      const el = inputRef.current;
      const len = el.value.length;
      el.focus();
      el.setSelectionRange(len, len);
    }
  }, [isEditingName]);

  return (
    <div>
      <MotionConfig transition={{ type: "spring", bounce: 0, duration: 0.5 }}>
        <Dialog.Root open={isOpen} onOpenChange={handleDialogChange}>
          <AnimatePresence initial={false} mode="popLayout">
            {!isOpen && (
              <Dialog.Trigger
                style={{ cursor: "pointer" }}
                render={
                  <motion.div
                    className={styles.wallet}
                    layoutId={LAYOUT_ID.wallet}
                    style={{ background: bg, width: 200 }}
                    whileHover={{ scale: 0.98, opacity: 0.8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={styles.column}>
                      <motion.div
                        layoutId={LAYOUT_ID.topTrailing}
                        className={styles.icon}
                      >
                        <Bell2Icon
                          className={styles.shape}
                          color="var(--white-a12)"
                        />
                      </motion.div>

                      <motion.span
                        layoutId={LAYOUT_ID.bottomTrailing}
                        className={styles.details}
                      >
                        <input
                          data-text="primary"
                          className={styles.text}
                          type="text"
                          value={wallet.name}
                          disabled
                          placeholder="Wallet Name"
                          aria-label="Wallet name"
                        />
                        <motion.p data-text="secondary" className={styles.text}>
                          ${wallet.balance.toLocaleString()}
                        </motion.p>
                      </motion.span>
                    </div>

                    <div className={styles.column}>
                      <motion.div
                        role="button"
                        tabIndex={0}
                        aria-label="Wallet options"
                        variants={VARIANTS.blur}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        whileHover={{ scale: 0.98 }}
                        whileTap={{ scale: 0.95 }}
                        className={styles.options}
                        layoutId={LAYOUT_ID.topLeading}
                      >
                        <DotGrid1X3HorizontalIcon color="var(--white-a12)" />
                      </motion.div>

                      <motion.div
                        layout
                        layoutId={LAYOUT_ID.bottomLeading}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0, filter: "blur(10px)" }}
                        exit={{ opacity: 0 }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "fit-content",
                          height: 32,
                          padding: "0 16px",
                          color: "var(--white-a10)",
                          background: "var(--white-a4)",
                          borderRadius: 100,
                        }}
                      >
                        <motion.p
                          className={styles.text}
                          variants={VARIANTS.blur}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          Customize
                        </motion.p>
                      </motion.div>
                    </div>
                  </motion.div>
                }
              />
            )}
          </AnimatePresence>

          <Dialog.Portal keepMounted>
            <Dialog.Backdrop className={styles.backdrop} />
            <Dialog.Title className={styles.sronly}>
              Wallet Settings
            </Dialog.Title>

            <AnimatePresence initial={false} mode="wait">
              {isOpen && (
                <Dialog.Popup
                  render={
                    <div className={styles.popup}>
                      <AnimatePresence mode="popLayout">
                        {isPickingColor && (
                          <motion.div
                            className={styles.picker}
                            key="picker"
                            variants={VARIANTS.picker}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <fieldset
                              className={styles.swatch}
                              aria-label="Color options"
                            >
                              {COLORS.map((c) => (
                                <motion.div
                                  key={c}
                                  role="button"
                                  tabIndex={0}
                                  aria-label={`Select ${c.replace("--family-", "")} color`}
                                  aria-pressed={wallet.color === c}
                                  className={styles.color}
                                  style={{ background: `var(${c})` }}
                                  onClick={() =>
                                    setWallet((w) => ({ ...w, color: c }))
                                  }
                                  onKeyDown={(e) =>
                                    (e.key === "Enter" || e.key === " ") &&
                                    setWallet((w) => ({ ...w, color: c }))
                                  }
                                  whileHover={{ opacity: 0.8 }}
                                  data-selected={wallet.color === c}
                                />
                              ))}
                            </fieldset>
                            <motion.div
                              role="button"
                              tabIndex={0}
                              aria-label="Save color selection"
                              onClick={handleSaveColors}
                              onKeyDown={(e) =>
                                (e.key === "Enter" || e.key === " ") &&
                                handleSaveColors()
                              }
                              whileHover={{ scale: 0.98, opacity: 0.8 }}
                              whileTap={{ scale: 0.95 }}
                              style={{ background: bg }}
                              className={styles.save}
                            >
                              Save
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        className={styles.wallet}
                        layoutId={LAYOUT_ID.wallet}
                        style={{ background: bg, width: 400 }}
                      >
                        <div className={styles.column}>
                          <motion.div
                            layoutId={LAYOUT_ID.topTrailing}
                            className={styles.icon}
                          >
                            <Bell2Icon
                              className={styles.shape}
                              color="var(--white-a12)"
                            />
                          </motion.div>

                          <motion.span
                            layoutId={LAYOUT_ID.bottomTrailing}
                            className={styles.details}
                          >
                            <input
                              ref={inputRef}
                              data-text="primary"
                              className={styles.text}
                              type="text"
                              value={wallet.name}
                              disabled={!isEditingName}
                              placeholder="Wallet Name"
                              aria-label="Wallet name"
                              onChange={(e) => handleNameChange(e.target.value)}
                              onBlur={finishNameEdit}
                              onKeyDown={(e) =>
                                e.key === "Enter" && finishNameEdit()
                              }
                            />
                            <motion.p
                              data-text="secondary"
                              className={styles.text}
                              animate={{ opacity: isEditingName ? 0.5 : 1 }}
                            >
                              ${wallet.balance.toLocaleString()}
                            </motion.p>
                          </motion.span>
                        </div>

                        <div className={styles.column}>
                          <motion.div
                            role="button"
                            tabIndex={0}
                            aria-label="Copy wallet address to clipboard"
                            variants={VARIANTS.blur}
                            initial="hidden"
                            animate={{
                              ...VARIANTS.blur.visible,
                              opacity: isEditingName ? 0.5 : 1,
                            }}
                            exit="hidden"
                            whileHover={{ scale: 0.98 }}
                            whileTap={{ scale: 0.95 }}
                            layoutId={LAYOUT_ID.topLeading}
                            className={styles.copy}
                            onClick={copyAddress}
                            onKeyDown={(e) =>
                              (e.key === "Enter" || e.key === " ") &&
                              copyAddress()
                            }
                          >
                            <p data-text="primary" className={styles.text}>
                              Copy Address
                            </p>
                            <SquareBehindSquare2Icon
                              strokeWidth={3}
                              className={styles.symbol}
                            />
                          </motion.div>

                          <motion.div
                            role="button"
                            tabIndex={0}
                            aria-label={label}
                            layout
                            layoutId={LAYOUT_ID.bottomLeading}
                            className={styles.customize}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0 }}
                            whileHover={{ scale: 0.98, opacity: 0.8 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                              color: isEditingName ? bg : "var(--white-a10)",
                              background: isEditingName
                                ? "var(--white-a12)"
                                : "var(--white-a4)",
                              borderRadius: 100,
                            }}
                            onClick={handleCustomizeClick}
                            onKeyDown={(e) =>
                              (e.key === "Enter" || e.key === " ") &&
                              handleCustomizeClick()
                            }
                          >
                            <motion.p
                              key={label}
                              className={styles.text}
                              variants={VARIANTS.blur}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              {label}
                            </motion.p>
                          </motion.div>
                        </div>
                      </motion.div>
                    </div>
                  }
                />
              )}
            </AnimatePresence>
          </Dialog.Portal>
        </Dialog.Root>
      </MotionConfig>
    </div>
  );
}
