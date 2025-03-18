import { ReactNode } from "react";
import { Link } from "react-router-dom";

type SidebarLinkProps = {
  to: string;
  icon?: ReactNode;
  children?: ReactNode;
};

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, children }) => {
  return (
    <li className="mb-2">
      <Link
        to={to}
        className="flex items-center p-2 text-base font-normal rounded-lg hover:font-bold hover:text-dsp-orange"
      >
        {icon && (
          <span className="mr-2 hover:text-dsp-orange transition-colors duration-200">
            {icon}
          </span>
        )}
        <p className="hover:text-dsp-orange transition-colors duration-200">
          {children}
        </p>
      </Link>
    </li>
  );
};

export default SidebarLink;
