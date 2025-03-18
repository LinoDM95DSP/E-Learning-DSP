//Utils
import { ReactNode, useState } from "react";
//Components
import LinkSidebar from "../ui_elements/links/link_sidebar";
import SidebarBase from "../base/base_sidebar";
import ButtonToggleSmall from "../ui_elements/buttons/button_toggle_sidebar";
//Assets
import LogoDSP from "../../assets/dsp_no_background.png";
import { IoMdArrowDropleft } from "react-icons/io";

type SidebarNavigationProps = {
  links: { to: string; title: string; icon?: ReactNode }[];
  middleLinks: { to: string; title: string; icon?: ReactNode }[];
  bottomLinks: { to: string; title: string; icon?: ReactNode }[];
  className?: string;
};

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  links,
  middleLinks,
  bottomLinks,
  className = "",
}) => {
  //TODO: add open close logic
  //TODO: add generic bottom section
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarBase isOpen={isOpen} className="relative mr-5">
      <ButtonToggleSmall
        classNameButton="absolute top-0 right-0 transform translate-x-1/2 translate-y-[calc(130%-2px)]"
        classNameIcon={
          isOpen
            ? "rotate-180 transition-transform duration-300"
            : "transition-transform duration-300"
        }
        icon={<IoMdArrowDropleft />}
        onClick={() => setIsOpen((prev) => !prev)}
      />

      {!isOpen && (
        <div className="flex flex-col h-full items-center justify-center">
          {/* NavigationLinks */}
          <nav className={className}>
            <ul>
              {links.map((link, index) => (
                <li key={index}>
                  <LinkSidebar to={link.to} icon={link.icon}></LinkSidebar>
                </li>
              ))}
            </ul>
            {/* Divider */}
            <div className="my-4 w-full border-t border-dsp-orange" />
            <nav className={className}>
              {/* MiddleLinks */}
              <ul>
                {middleLinks.map((link, index) => (
                  <li key={index}>
                    <LinkSidebar to={link.to} icon={link.icon}></LinkSidebar>
                  </li>
                ))}
              </ul>
            </nav>
          </nav>

          {/* BottomLinks*/}
          <div className="">
            {/* Divider */}
            <div className="my-4 w-full border-t border-dsp-orange" />
            <nav className={className}>
              <ul>
                {bottomLinks.map((bottomLink, index) => (
                  <li key={index}>
                    <LinkSidebar
                      to={bottomLink.to}
                      icon={bottomLink.icon}
                    ></LinkSidebar>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
      {isOpen && (
        <div className="flex flex-col h-full items-center gap-10">
          <img src={LogoDSP} alt="LogoDSP" className="mb-4" />
          {/* NavigationLinks */}
          <nav className={className}>
            <ul>
              {links.map((link, index) => (
                <li key={index}>
                  <LinkSidebar to={link.to} icon={link.icon}>
                    {link.title}
                  </LinkSidebar>
                </li>
              ))}
            </ul>
            {/* Divider */}
            <div className="my-4 w-full border-t border-dsp-orange" />
            {/* MiddleLinks */}
            <ul>
              {middleLinks.map((link, index) => (
                <li key={index}>
                  <LinkSidebar to={link.to} icon={link.icon}>
                    {link.title}
                  </LinkSidebar>
                </li>
              ))}
            </ul>
          </nav>
          {/* BottomLinks*/}

          <div className="mt-auto">
            {/* Divider */}
            <div className="my-4 w-full border-t border-dsp-orange" />
            <nav className={className}>
              <ul>
                {bottomLinks.map((bottomLink, index) => (
                  <li key={index}>
                    <LinkSidebar to={bottomLink.to} icon={bottomLink.icon}>
                      {bottomLink.title}
                    </LinkSidebar>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </SidebarBase>
  );
};

export default SidebarNavigation;
