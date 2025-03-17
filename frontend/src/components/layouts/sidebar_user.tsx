//Components
import SidebarBase from "../base/base_sidebar";
//Assets
import { FaRegUserCircle } from "react-icons/fa";
type SidebarUserProps = {
  className?: string;
};

const SidebarUser: React.FC<SidebarUserProps> = ({ className = "" }) => {
  return (
    <SidebarBase className={`ml-5 rounded-l-xl shadow-[-10px_0_10px_-5px_rgba(0,0,0,0.08)]`}>
      <div className={` flex flex-col ${className}`}>
          <FaRegUserCircle size={30}/>
      </div>
    </SidebarBase>
  );
};

export default SidebarUser;
