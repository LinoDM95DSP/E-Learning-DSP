import { ReactNode, useState } from "react";
import { IoMdMenu, IoMdClose } from "react-icons/io";
import clsx from "clsx";
import LinkSidebar from "../ui_elements/links/link_sidebar";

type NavLink = { to: string; title: string; icon?: ReactNode };

type HeaderNavigationProps = {
  logo?: ReactNode;
  links: NavLink[];
  rightContent?: NavLink[];
  className?: string;
};

const HeaderNavigation: React.FC<HeaderNavigationProps> = ({
  logo,
  links,
  rightContent = [],
  className = "",
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderNavLinks = (navLinks: NavLink[], showTitle = true) =>
    navLinks.map((link, index) => (
      <li key={index}>
        <LinkSidebar to={link.to} icon={link.icon}>
          {showTitle ? link.title : null}
        </LinkSidebar>
      </li>
    ));

  return (
    <header
      className={clsx(
        "w-full py-3 bg-white shadow flex items-center justify-between border-b-3 border-dsp-orange px-30 gap-5",
        className
      )}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        {logo && <div className="h-8 flex items-center">{logo}</div>}
        {/* Mobile Burger Button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden p-2 rounded hover:bg-gray-100"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <IoMdClose size={24} /> : <IoMdMenu size={24} />}
        </button>
      </div>

      {/* Center: Desktop Navigation */}
      <nav className="hidden md:flex flex-1 justify-center">
        <ul className="flex items-center gap-6">{renderNavLinks(links)}</ul>
      </nav>

      {/* Right: Custom Content */}
      <div className="hidden md:flex items-center gap-4 min-w-[200px] justify-end">
        <ul className="flex items-center gap-4">
          {renderNavLinks(rightContent)}
        </ul>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md z-50 md:hidden">
          <nav className="flex flex-col px-6 py-4 gap-4 border-t border-gray-200">
            <ul className="flex flex-col gap-3">{renderNavLinks(links)}</ul>
            {rightContent.length > 0 && (
              <ul className="flex flex-col gap-3 border-t border-dsp-orange pt-3">
                {renderNavLinks(rightContent)}
              </ul>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderNavigation;
