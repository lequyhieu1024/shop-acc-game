import {Logo} from "@/components/(admin)/(header)/Logo";
import {SearchForm} from "@/components/(admin)/(header)/SearchForm";
import {NavMenu} from "@/components/(admin)/(header)/NavMenu";

export const Header = () => {
    return (
        <div className="header-wrapper m-0">
            <Logo/>
            <SearchForm/>
            <div className="nav-right col-6 pull-right right-header p-0">
                <NavMenu/>
            </div>
        </div>
    )
}