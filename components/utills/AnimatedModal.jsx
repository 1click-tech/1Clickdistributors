import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const AnimatedModal = ({ modalOpen, close, open, onClose, children }) => {
  // stop scrolling in background if AnimatedModal is open
  useEffect(() => {
    if (!modalOpen) return;
    // Disable background scrolling
    document.body.style.overflow = "hidden";

    // Cleanup function to restore scrolling
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]);
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full z-50 flex justify-center items-center"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-0 left-0 w-full h-full bg-[#000000e1]"
            onClick={() => {
              close && close(), onClose && onClose();
            }}
          ></motion.div>
          <motion.div
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
            className="bg-white  rounded-lg shadow-lg z-50 overflow-hidden scrollbar-thin"
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AnimatedModal;
