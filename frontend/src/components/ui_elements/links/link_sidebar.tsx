import { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type SidebarLinkProps = {
  to: string;
  icon?: ReactNode;
  children?: ReactNode;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children }) => {
  return (

      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center p-2 text-base rounded-lg hover:text-dsp-orange ${
            isActive ? "text-dsp-orange font-bold" : ""
          }`
        }
      >
        {icon && (
          <span className="mr-2 transition-colors duration-200">{icon}</span>
        )}
        <span className="transition-colors duration-200">{children}</span>
      </NavLink>

  );
};

export default SidebarLink;
