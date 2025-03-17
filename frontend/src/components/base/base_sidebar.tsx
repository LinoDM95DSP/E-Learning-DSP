import { ReactNode } from "react";

type SidebarBaseProps = {
  children: ReactNode;
  className?: string;
};

const SidebarBase: React.FC<SidebarBaseProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`bg-dsp-orange_light p-10 h-screen ${className}`}>
      {children}
    </div>
  );
};

export default SidebarBase;
