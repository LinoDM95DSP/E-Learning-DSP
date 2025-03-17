//Utils
import { ReactNode, useState } from "react";
//Components
import LinkSidebar from "../ui_elements/links/link_sidebar";
import SidebarBase from "../base/base_sidebar";
//Assets

type SidebarNavigationProps = {
  links: { to: string; title: string; icon?: ReactNode }[];
  className?: string;
};

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  links,
  className = "",
}) => {
  //TODO: add open close logic
  //TODO: add generic bottom section
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SidebarBase className="mr-5 rounded-r-xl shadow-[10px_0_10px_-5px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col items-center settings-section mt-4">
        <nav className={` ${className}`}>
          <ul className="">
            {links.map((link, index) => (
              <li key={index}>
                <LinkSidebar to={link.to} icon={link.icon}>
                  {link.title}
                </LinkSidebar>
              </li>
            ))}
          </ul>
        </nav>

        <div className="">
          {/**Bottom */}
          <p>Settings</p>
        </div>
      </div>
    </SidebarBase>
  );
};

export default SidebarNavigation;
