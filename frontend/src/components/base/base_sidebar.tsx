import { ReactNode } from "react";
import { motion } from "framer-motion";

type SidebarBaseProps = {
  children: ReactNode;
  className?: string;
  isOpen?: boolean;
};

const SidebarBase: React.FC<SidebarBaseProps> = ({
  children,
  isOpen,
  className = "",
}) => {
  return (
    <motion.div
      className={`px-10 py-2 bg-dsp-orange_light h-screen ${className}`}
      animate={{ width: isOpen ? "300px" : "10px" }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export default SidebarBase;
