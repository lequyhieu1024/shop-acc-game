import {Logo} from "@/components/(admin)/(sidebar)/Logo";
import {Navbar} from "@/components/(admin)/(sidebar)/Navbar";

export const Sidebar = () =>{
    return (
        <>
            <div id="sidebarEffect"></div>
            <div>
                <Logo/>
                <Navbar/>
            </div>
        </>
    );
}