import React from "react";
import moment from "moment";
import { getTypeOf, stringToDateCorrectFull } from "./utils";



type IinputWrapperProps = {
    date?:string
    onChange?:(date:string)=>void
    focus?:boolean
}

type IinputWrapperState = 
{
    method:'d'|'m'|'y'
}

class InputWrapper<P extends IinputWrapperProps, S extends IinputWrapperState> extends React.Component<P,S>
{
    protected _date:string; // display date
    protected _value:string; // valud date
    protected _fsystem:string='YYYY-MM-DD';
    protected _fmonth:string='YYYY-MM';

    // indikasi pada saat pertama kali
    // user mengklik/pilih tanggal
    // karena biasanya inisial tanggal kosong
    // sedangkan inisialisasi adalah tanggal saat ini
    protected _first_set:boolean; 

    // array prep
    protected _days:any[]=[];
    protected _dates:any[]=[];
    protected _months:any[]=[];
    protected _years:any[]=[];

    constructor(props:P)
    {
        super(props);
        this._date='';
        this._value='';
        this._first_set=true;
        this.state=this.gState(props);        
        this.changeDate(props.date);

        this.prepDays(); // hari dalam 1 minggu

        this.applyDate(this._value); // apply date
    }

    protected gState=(props?:P):S=>
    {
        return {
            method:'d',
        } as S;
    }

    protected changeDate=(date?:any):boolean=>
    {
        let changed:boolean=false;
        let valdate=typeof date=='string'?date.toString().trim():'';
        const split=valdate.split('-');
        valdate=stringToDateCorrectFull(split[0],split[1],split[2],this._fsystem);
        const mom=valdate.length>0?moment(valdate):moment();
        const newdate=mom.isValid()?mom.format(this._fsystem):moment().format(this._fsystem);
        if(this._value!==newdate)
        {
            changed=true;
            this._value=newdate;
        }
        return changed;
    }

    protected applyDate=(date?:any):boolean=>
    {
        let valdate=typeof date=='string'?date.toString().trim():'';
        const mom=valdate.length>0?moment(valdate):moment();
        const newdate=mom.isValid()?mom.format(this._fsystem):moment().format(this._fsystem);
        let changed:boolean=false;
        if(this._date!==newdate)
        {
            this._date=newdate;            
            this.prepDates();
            this.prepMonts();
            this.prepYears();
            changed=true;
        }
        return changed;
    }

    protected prepDays=()=>
    {
        const days:string[]=['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        this._days=[];
        for(let i=0; i<days.length; i++)
        {
            this._days.push(<div>{days[i]}</div>);
        }
    }

    protected prepDates=()=>
    {
        const daysInMonth = moment(this._date).daysInMonth();
        const nowMonth=moment(this._date).format('YYYY-MM');
        const firstWeekdayOfTheMonth = moment(new Date(nowMonth)).isoWeekday();
        const daysInBeforeMonth = moment(this._date).subtract(1, 'months').daysInMonth()
        this._dates=[];
        for(let i=1; i <= firstWeekdayOfTheMonth; i++)
        {
            const valbef=daysInBeforeMonth + 1 - i;
            const val=valbef.toString();
            const curr=this._value===moment(moment(this._date).format(this._fmonth)+'-'+val).format(this._fsystem);
            const similar=val===moment(this._value).format('D');
            // add top position array
            this._dates.unshift(<a className={`wrap_item disabled ${curr?'selected':similar?'active':''}`}>{valbef}</a>);
        }
        // lo day months
        for(let i = 1; i <= daysInMonth; i++) 
        {
            const val=i.toString();
            const curr_value=moment(this._date).format(this._fmonth)+'-'+val;
            const curr=this._value===moment(curr_value).format(this._fsystem);
            const similar=val===moment(this._value).format('D');
            const of_val=moment(curr_value).format(this._fsystem);
            const date=new Date(of_val);
            const minggu=date?date.getDay()===0:false;
            const sabtu=date?date.getDay()===6:false;
            const jumat=date?date.getDay()===5:false;
            this._dates.push(<a onClick={e=>{ e.preventDefault(); this.setDate(of_val); }} className={`wrap_item ${minggu?'minggu':sabtu?'sabtu':jumat?'jumat':''} ${curr?'selected':similar?'active':''}`}><span>{i}</span></a>);
        } 
    }

    protected prepMonts=()=>
    {
        const months:string[]=['','Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        this._months=[];
        for(let i=1; i<months.length; i++)
        {
            const val=i.toString();
            const curr=moment(this._value).format(this._fmonth);
            const next=moment(moment(this._date).format('YYYY')+'-'+val+'-01').format(this._fmonth);

            const selected=curr===next;
            const similar=val===moment(this._date).format('M');
            this._months.push(<a onClick={e=>{ e.preventDefault(); this.setMonth(val); }} className={`wrap_item ${selected?'selected':similar?'active':''}`}><span>{months[i]}</span></a>);
        }
    }

    protected prepYears=()=>
    {
        const years:any[] = [];        
        const tahun = parseInt(moment(this._value).format('YYYY'));
        const mulai=tahun - 3;
        const sampai = tahun + 4;
        for(let i=mulai; i<sampai; i++)
        {
            const val=i.toString();
            const curr=i===parseInt(moment(this._value).format('YYYY'));
            const similar=i===parseInt(moment(this._date).format('YYYY'));

            years.push(<a onClick={e=>{ e.preventDefault(); this.setYear(val); }} className={`wrap_item ${curr?'selected':similar?'active':''}`}><span>{i}</span></a>)
        }        
        this._years=years;
    }

    // date full : YYYY-MM-DD
    protected setDate=(val:any)=>
    {
        if(!getTypeOf(val,['number','string'])) return;

        val=val.toString().trim();
        let curr=moment(this._value).format(this._fsystem);
        if(val!==curr)
        {
            let newValue=val;
            if(this.changeDate(newValue))
            {
                this.applyDate(this._value);
                this.forceUpdate(this.callPropsChange);
            }
        }
        else 
        {
            if(this._first_set)
            {
                this._first_set=false;
                this.callPropsChange();
            }
        }
    }

    protected setMonth=(val:any)=>
    {
        if(!getTypeOf(val,['number','string'])) return;
        val=val.toString().trim();
        let curr=moment(this._value).format('D');
        if(val!==curr)
        {
            let newValue=moment(this._value).format('YYYY')+'-'+val+'-'+moment(this._value).format('D');
            if(this.changeDate(newValue))
            {
                this.applyDate(this._value);
                if(this.state.method==='y')
                {
                    this.setState({method:'m'},this.callPropsChange);
                }
                else
                if(this.state.method==='m') 
                {
                    this.setState({method:'d'},this.callPropsChange);
                }
                else {

                    this.forceUpdate(this.callPropsChange);
                }
            }
        }
    }

    protected setYear=(val:any)=>
    {
        if(!getTypeOf(val,['number','string'])) return;
        val=val.toString().trim();
        let curr=moment(this._value).format('D');
        if(val!==curr)
        {
            let newValue=val+'-'+moment(this._value).format('MM-DD');
            if(this.changeDate(newValue))
            {
                this.applyDate(this._value);
                if(this.state.method==='y')
                {
                    this.setState({method:'m'},this.callPropsChange);
                }
                else
                if(this.state.method==='m') 
                {
                    this.setState({method:'d'},this.callPropsChange);
                }
                else {

                    this.forceUpdate(this.callPropsChange);
                }
            }
        }
    }

    protected callPropsChange=()=>
    {
        if(typeof this.props.onChange==='function')
        {
            this.props.onChange(this._value);
        }
    }

    protected onChMethod=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        let method:any=this.state.method;
        method=method==='d'?'m':method==='m'?'y':method==='y'?'d':method;
        if(this.state.method!==method)
        {
            this.setState({method:method} as never);
        }
    }

    protected onDatePrev=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        const method=this.state.method;

        let toDate:string='';
        let handled:boolean=false;    
        if(method==='m')
        {
            // prev year
            toDate=moment(`${this._date}`).subtract(1, 'years').format(this._fsystem);
            handled=true;
        }
        else 
        if(method==='d')
        {
            // prev month
            toDate=moment(`${this._date}`).subtract(1, 'month').format(this._fsystem);
            handled=true;
        }

        if(handled && this.applyDate(toDate))
        {
            this.forceUpdate();
        }
    }

    protected onDateNext=(e?:React.MouseEvent)=>
    {
        if(e) e.preventDefault();
        const method=this.state.method;

        let toDate:string='';
        let handled:boolean=false;      

        if(method==='m')
        {
            // next year
            toDate=moment(`${this._date}`).add(1, 'years').format(this._fsystem);
            handled=true;
        }
        else if(method==='d')
        {
            // next month
            toDate=moment(`${this._date}`).add(1, 'month').format(this._fsystem);
            handled=true;
        }

        if(handled && this.applyDate(toDate))
        {
            this.forceUpdate();
        }
    }

    componentDidUpdate(prev: Readonly<P>, prevState: Readonly<S>, snapshot?: any)
    {
        let skip:boolean=false;

        if(prev.date!==this.props.date)        
        {
            if(this.changeDate(this.props.date))
            {
                skip=true;
                this.applyDate(this._value);
                this.forceUpdate();                
            }
        }

        if((!skip) && prev.focus!==this.props.focus)
        {
            if(!this.props.focus && this.state.method!=='d')
            {
                this.setState({method:'d'});
            }
        }
    }

    render()
    {
        const {method}=this.state;
        const show_dates=method==="d";
        const show_month=method==="m";
        const show_year=method==="y";
        const mom=moment(this._date);
        let label=method==='d'?mom.format('MMM - YYYY'):mom.format('YYYY');
        return (
            <div className={`InputTanggalPopup`}>
                <div className="InputTanggalWrap">
                    <div className="wrap_state">
                        <button onClick={this.onDatePrev} type="button">&#8592;</button>
                        <button type="button" onClick={this.onChMethod}>{label}</button>
                        <button onClick={this.onDateNext} type="button">&#8594;</button>
                    </div>
                    <div className={`wrap_days ${show_dates?'show':'hide'}`}>{this._days}</div>
                    <div className={`wrap_dates ${show_dates?'show':'hide'}`}>{this._dates}</div>
                    <div className={`wrap_months ${show_month?'show':'hide'}`}>{this._months}</div>
                    <div className={`wrap_years ${show_year?'show':'hide'}`}>{this._years}</div>
                </div>
            </div>
        );
    }
}

export default InputWrapper;