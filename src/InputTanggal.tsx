import React from "react";
import { getDocumentCaretPosition, getElementAttr, getFocusElement, randomString, stringToDateCorrectFull } from "./utils";
import InputTrack from "./InputTrack";
import InputWrapper from "./InputWrapper";

export type IInputTanggalProps = {
    name:string
    value?:string|null|undefined
    readonly?:boolean
    onChange?:(e:React.ChangeEvent<HTMLInputElement>)=>void
}

export type IInputTanggalState = {
    focus:boolean
    open:boolean    
    ymd_date:string|null|undefined
    ymd_month:string|null|undefined
    ymd_year:string|null|undefined
}

class InputTanggal<P extends IInputTanggalProps,S extends IInputTanggalState> extends React.Component<P,S>
{
    protected _random:string;
    protected _selector:string;
    protected _stwaitoscl:boolean;
    protected ndYmdDate:HTMLElement|null=null;
    protected ndYmdMonth:HTMLElement|null=null;
    protected ndYmdYear:HTMLElement|null=null;
    protected nd_input:HTMLInputElement|null=null;
    protected _trinput:InputTrack;


    constructor(props:P)
    {
        super(props);
        this._random=randomString();
        this._selector=`#${this._random}`;
        this._trinput=new InputTrack();
        this._trinput.setDate(props.value);
        this._stwaitoscl=false;
        this.state=this.gState(props);
    }

    protected gState=(props?:P):S=>
    {
        return {
            focus:false,
            open:false, 
            ymd_year:this._trinput.getYear(),
            ymd_month:this._trinput.getMonth(),
            ymd_date:this._trinput.getDate(),           
        } as S;
    }

    protected onYmdFocus=(e:React.FocusEvent<HTMLInputElement>)=>
    {
        //console.log("focus");
        this.setState({focus:true});
    }

    protected onYmdBlur=(e:React.FocusEvent<HTMLInputElement>)=>
    {
        if(this._stwaitoscl) return;

        requestAnimationFrame(()=>{
            if(!this.state.focus) return;

            let fel=getFocusElement();
            let closest=fel?fel.closest(this._selector):undefined;
            let closeFocus=!closest;
            let correntionValue=fel?!fel.closest(this._selector+' .InputTanggalBox'):false;
            if(correntionValue)
            {
                this.correctValue();
            }
            if(closeFocus)
            {
                this.setState({focus:false});
            }
        });
    }
    
    protected ymdFocusNext=(next?:boolean):HTMLInputElement|undefined=>
    {
        let attr=getElementAttr(getFocusElement(),'data-name');
        //console.log('focus el',attr);
        let target:any;

        const gonext:boolean=next!==undefined && next!==null?next:true;

        if(!attr)
        {
            const selfs:any[]=gonext?[this.ndYmdYear,this.ndYmdMonth,this.ndYmdDate]:[this.ndYmdDate,this.ndYmdMonth,this.ndYmdYear];
            for(let i=0; i<selfs.length; i++)
            {
                const el=selfs[i];
                if(el instanceof HTMLInputElement)
                {
                    target=el;
                    const val=(target.value||'').toString().trim();
                    if(val.length<1) break;
                }
            }           
        }
        else 
        {            
            if(attr==='year') target=gonext?this.ndYmdMonth:undefined;
            else
            if(attr==='month') target=gonext?this.ndYmdDate:this.ndYmdYear;
            else
            if(attr==='date') target=gonext?undefined:this.ndYmdMonth;
        }

        if(target && target instanceof HTMLInputElement)        
        {
            if(typeof target.focus==='function'){
                target.focus();
            }
        }
        return target;
    }

    protected onOutsideClick=(e:MouseEvent)=>
    {
        //console.log("start outside click");
        const target = e.target as HTMLElement;
        let closest=target.closest(this._selector+' .InputTanggalBox');
        let close2=target.closest(this._selector+' .InputTanggalDropDown');
        this._stwaitoscl=true;
        requestAnimationFrame(()=>
        {
            //console.log("framout after. closest:",closest);
            this._stwaitoscl=false;
            if(closest)
            {
                const hasNextFocus=()=>{
                    if(!close2) this.ymdFocusNext();
                };

                if(!this.state.focus)
                {
                    this.setState({focus:true},hasNextFocus);
                    return;
                }
                let atr=getElementAttr(target,'data-name');
                if(['year','month','date'].indexOf(atr)<0)
                {
                    hasNextFocus();
                }
            }
            else 
            {
                if(this.state.focus && !close2)
                {
                    this.correctValue();                   
                    this.setState({focus:false});
                }
            }           
        });
    }

    protected correctValue=()=>
    {
        let val=this._trinput.correctFull(this.state.ymd_year,this.state.ymd_month,this.state.ymd_date);
        this._trinput.setDate(val);
    }

    protected onChangeDate=(date:string)=>
    {
        this._trinput.setDate(date);
        this.setState({
            ymd_year:this._trinput.getYear(),
            ymd_date:this._trinput.getDate(),
            ymd_month:this._trinput.getMonth(),
        },this.callPropsChange)
    }

    protected callPropsChange=()=>
    {
        if(!this.nd_input) return;
        if(typeof this.props.onChange==='function')
        {
            const props=this.props;
            let value=stringToDateCorrectFull(this.state.ymd_year,this.state.ymd_month,this.state.ymd_date);
            let target:any={
                name:props.name,
                value:value,
            };
            const e:any={
                target,
                currentTarget:target,
                preventDefault:function(){},
                stopPropagation:function(){},
            };
            this.props.onChange(e);
        }
    }

    protected preventKeydownNum=(e:React.KeyboardEvent<HTMLInputElement>)=>
    {
        const is_digit=/^\d$/.test(e.key);
        const key=e.key.toLowerCase();        
        const is_anykey=['enter','backspace','tab','delete','arrowleft','arrowright'].indexOf(e.key.toLowerCase())>=0;
        const is_left=key==='arrowleft';
        const is_right=key==='arrowright';

        let yes=is_digit || is_anykey;
        if (!yes) {
            e.preventDefault();
            return;
        }

        if(is_digit)        
        {
            const el:HTMLInputElement=e.target as HTMLInputElement;
            let maxLength=el===this.ndYmdYear?4:(el===this.ndYmdMonth || el===this.ndYmdDate)?2:0;
            let value:string="value" in el?el.value:"";
            if(maxLength>0 && value.length>=maxLength)
            {                
                const nextEl:HTMLElement|null=el===this.ndYmdYear?this.ndYmdMonth:(el===this.ndYmdMonth?this.ndYmdDate:null);
                if(nextEl && "value" in nextEl)
                {                    
                    e.preventDefault();
                    const key=e.key.toString();
                    let currVal:string="value" in nextEl?nextEl.value+key:"";
                    nextEl.value=currVal;
                    let korek=nextEl.value;
                    let input_name:string="";
                    if(nextEl===this.ndYmdMonth)
                    {
                        input_name="ymd_month";
                        let test=parseInt(korek as string);
                        if(!isNaN(test))
                        {
                            test=test<0?0:test>12?12:test;
                            korek=test.toString();
                        }
                    }
                    else
                    if(nextEl===this.ndYmdDate)
                    {
                        input_name="ymd_date";
                        let test=parseInt(korek as string);
                        if(!isNaN(test))
                        {
                            test=test<0?0:test>31?31:test;
                            korek=test.toString();
                        }
                    }
                    if(currVal!==korek)
                    {
                        nextEl.value=korek;
                    }                    
                    if(input_name.length>0)
                    {
                        const state:any=this.state;
                        state[input_name]=korek;
                        this.setState(state,this.ymdFocusNext);                        
                    }
                    else {
                        this.ymdFocusNext();
                    }
                }
            }
            return;
        }

        if(is_left)
        {
            let caret_pos=getDocumentCaretPosition(e.target as HTMLElement);
            if(caret_pos<1)
            {
                e.preventDefault();
                this.ymdFocusNext(false);
                return;
            }
        }
        if(is_right)
        {
            let value:string="value" in e.target?e.target.value as string:"";
            let car_pos=getDocumentCaretPosition(e.target as HTMLElement);
            let val_pos=value.length;
            if(car_pos===val_pos)
            {
                e.preventDefault();
                this.ymdFocusNext();
                return;
            }
        }
    }

    protected preventKeyUp=(e:React.KeyboardEvent<HTMLInputElement>)=>
    {        
        const key=(e.key).toString().toLowerCase();
        const is_back=key==='backspace';        
        if(is_back)
        {
            let value=(e.target instanceof HTMLInputElement)?(e.target.value||''):'';
            if(value.length<1)
            {
                e.preventDefault();
                this.ymdFocusNext(false);
            }
            return;
        }
    }

    protected onYmdChange=(e:React.ChangeEvent<HTMLInputElement>)=>
    {
        const name='ymd_'+getElementAttr(e.target,'data-name');
        const state:any=this.state;
        let value=e.target.value||'';        
        if(this.state.focus)
        {
            if(name==='ymd_year' && value.length>=4)
            {                
                value=this._trinput.correctY(value);
            }
            else
            if(name==='ymd_month' && value.length>=2)
            {
                value=this._trinput.correctM(value);                
            }
            else
            if(name==='ymd_date' && value.length>=2)
            {
                value=this._trinput.correctD(value);
            }
        }
        state[name]=value;
        this.setState({...state},this.callPropsChange);
    }

    componentDidMount()
    {
        window.addEventListener("mousedown",this.onOutsideClick);
    }

    componentWillUnmount(){
        window.removeEventListener("mousedown",this.onOutsideClick);
    }   

    render()
    {
        const props=this.props;
        const {focus,open}=this.state;
        const {_trinput}=this;
        const {ymd_year,ymd_month,ymd_date}=this.state;
        const value_wrap=focus?[ymd_year,ymd_month,ymd_date].join('-'):_trinput.getValue();
        const name=props.name?props.name:this._random+'_input_tanggal';
        const readonly=props.readonly!==null && props.readonly!==null?props.readonly:false;
        return (
            <div id={`${this._random}`} className={`InputTanggal ${focus?'focus':''} ${open?'open':''}`}>    
                <input ref={fn=>this.nd_input=fn} type="hidden" name={name} value={value_wrap} />
                <div className="InputTanggalBox">
                    <input type="text" style={{width:"1px",border:'transparent','visibility':'hidden'}} />
                    <div className="box_ymd">
                        <input ref={fn=>this.ndYmdYear=fn} value={ymd_year||''} readOnly={readonly} type="text" data-name="year" size={3} maxLength={4} placeholder="YYYY" onFocus={this.onYmdFocus} onBlur={this.onYmdBlur} onKeyDown={this.preventKeydownNum} onKeyUp={this.preventKeyUp} onChange={this.onYmdChange} spellCheck="false" autoComplete="off" className="y" />
                        <span>-</span>
                        <input ref={fn=>this.ndYmdMonth=fn} value={ymd_month||''} readOnly={readonly} type="text" data-name="month" size={3} maxLength={2} placeholder="MM" onFocus={this.onYmdFocus} onBlur={this.onYmdBlur} onKeyDown={this.preventKeydownNum} onKeyUp={this.preventKeyUp} onChange={this.onYmdChange} spellCheck="false" autoComplete="off" className="m" />
                        <span>-</span>
                        <input ref={fn=>this.ndYmdDate=fn} value={ymd_date||''} readOnly={readonly} type="text" data-name="date" size={2} maxLength={2} placeholder="DD" onFocus={this.onYmdFocus} onBlur={this.onYmdBlur} onKeyDown={this.preventKeydownNum} onKeyUp={this.preventKeyUp} onChange={this.onYmdChange} spellCheck="false" autoComplete="off" className="d"/>
                    </div>
                </div>  
                <div className="InputTanggalDropDown">
                    <InputWrapper
                        date={value_wrap}
                        onChange={this.onChangeDate}
                        focus={focus}
                    />             
                </div>
            </div>
        );
    }
}

export {InputTanggal};