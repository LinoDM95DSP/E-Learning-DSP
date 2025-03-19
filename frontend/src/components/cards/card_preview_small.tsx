import React from "react";
import { motion } from "framer-motion";

interface CardPreviewSmallProps {
  imageSrc?: string;
  title: string;
  description?: string;
  className?: string;
  progress?: number;
  onClick?: () => void;
}

const CardPreviewSmall: React.FC<CardPreviewSmallProps> = ({
  imageSrc,
  title,
  description,
  className,
  progress = 0,
  onClick,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative bg-white rounded-lg overflow-hidden max-w-xs shadow-md hover:cursor-pointer border-1 border-gray-100 ${className}`}
      onClick={onClick}
    >
      {imageSrc && <img src={imageSrc} alt={title} className="w-full h-auto" />}
      <div className="p-4 pb-16">
        <h2 className="mb-2 text-center">{title}</h2>
        <p className="text-base text-center">{description}</p>
        {/* Fortschrittsbalken */}
        <div className="absolute bottom-0 left-0 w-full p-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-dsp-orange h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-1 text-right">
            {progress}% abgeschlossen
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CardPreviewSmall;
