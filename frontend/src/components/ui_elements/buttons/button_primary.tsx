import React from "react";
import { motion } from "framer-motion";

interface ButtonPrimaryProps {
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
  classNameButton?: string;
  classNameIcon?: string;
}

const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({
  title,
  icon,
  onClick,
  classNameButton = "",
  classNameIcon = "",
}) => {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  };

  const iconVariants = {
    initial: { x: 0 },
    hover: { x: 6 },
  };

  return (
    <motion.button
      onClick={onClick}
      className={`flex items-center space-x-2 rounded-lg  py-2 px-4 bg-dsp-orange p-2
       hover:cursor-pointer focus:outline-none hover:font-bold
        ${classNameButton}`}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
    >
      {title && <p className="text-sm md:text-base ">{title}</p>}
      {icon && (
        <motion.span
          className={classNameIcon}
          variants={iconVariants}
          transition={{ type: "spring", stiffness: 500 }}
        >
          {icon}
        </motion.span>
      )}
    </motion.button>
  );
};

export default ButtonPrimary;
