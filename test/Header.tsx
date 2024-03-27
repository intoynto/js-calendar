import React from "react";
import { pathIsMatch, TWithRouterProps, withRouter } from "./withRouter";
import { NavLink } from "react-router-dom";
import { PATH } from "./consts";

type Iprops = TWithRouterProps & {

}

type Istate = {
}

class Comp<P extends Iprops,S extends Istate> extends React.Component<P,S>
{
    render()
    {
        return (
            <header>
                <div className="">
                    <nav>
                        <ul>
                            <li><NavLink to={PATH.page.url} end>Dev</NavLink></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

export default withRouter(Comp as any);