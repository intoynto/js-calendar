import React from "react";
import { Headsub } from "../any/Headsub";
import InputTanggal from "../../src";

type Iprops = {

}

type Istate = {
    values:any
    dinamic_options:any
}


class Comp<P extends Iprops,S extends Istate> extends React.Component<P,S>
{
    protected fn_tanggal:any;
    protected pk_tanggal:any;

    protected data:any;

    constructor(props:P)
    {
        super(props);
        this.data={
            set_tanggal:'2010-06-07',
            tanggal:'2010-06-07',
        };
    }

    private onCh=(e:React.ChangeEvent<HTMLInputElement>)=>
    {
        this.data[e.target.name]=e.target.value;
        this.forceUpdate();
    }

    render()
    {
        const data=this.data;
        return (
            <div>
                <Headsub title="Input Tanggal">
                    <div>Basic Input Tanggal Development Test</div>
                </Headsub>
                <Container asForm>           
                    <div>Selected Value : {data.tanggal }</div>            
                    <div className="flex gap-1.5 pt-2">
                        <div><InputTanggal name="tanggal" value={data.tanggal} onChange={this.onCh} /></div>
                        <div><input type="text" placeholder="another input" /></div>
                    </div>                    
                    <div className="pt-10"><button>Test Submit</button></div>
                </Container>
            </div>
        );
    }
}

type IcontainerProps={
    asForm?:boolean
    children:React.ReactNode
};

function Container(props:IcontainerProps)
{
    if(props.asForm)
    {
        return (<form>{props.children}</form>);
    }
    return <div>{props.children}</div>
}

export default Comp;