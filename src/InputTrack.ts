import moment from 'moment';
import { getTypeOf, stringToDateCorrectFull, unzero } from './utils';

type IInputTrackProps = {
    value?:string
}

class InputTrack 
{
    protected _fsystem:string='YYYY-MM-DD'; // format system
    protected _fmonth:string='YYYY-MM'; // format bulan
    protected _fdisplay:string='DD MMM YYYY' // display format
    protected _date:string;
    protected _display:string;

    constructor(props?:IInputTrackProps)
    {
        props=props||{} as IInputTrackProps;
        this._date='';
        this._display='';
        this.setDate(props.value);
    }

    // koreksi tanggal
    correctD=(value:any):string=>
    {
        let val:string=getTypeOf(value,['string','number'])?value.toString().trim():'';
        if(val.length<1)
        {
            return '';
        }
        let i=parseInt(val);
        if(isNaN(i)) return '01';
        i=i<1?1:(i>31?31:i);
        return i<10?'0'+i:i.toString();
    }

    // koreksi bulan
    correctM=(value:any):string=>
    {
        let val:string=getTypeOf(value,['string','number'])?value.toString().trim():'';
        if(val.length<1)
        {
            return '';
        }
        let i=parseInt(val);
        if(isNaN(i)) return '01';
        i=i<1?1:(i>12?12:i);
        return i<10?'0'+i:i.toString();
    }

    // koreksi tahun
    correctY=(value:any):string=>
    {
        let val:string=getTypeOf(value,['string','number'])?value.toString().trim():'';
        if(val.length<1)
        {
            return '';
        }
        const th=parseInt(val);
        if(isNaN(th)) return '';

        return th.toString();
    }
    // koreksi full
    correctFull=(year:any,month:any,date:any)=>
    {
        return stringToDateCorrectFull(year,month,date);
    }

    setDate=(value:any)=>
    {
        const val=getTypeOf(value,['string','number'])?value.toString().trim():'';
        const mom=moment(val);
        this._date=mom.isValid()?mom.format(this._fsystem):'';
        this._display=mom.isValid()?mom.format(this._fdisplay):'';
    }

    getDisplay=():string=>
    {
        return this._display;
    }

    getValue=():string=>
    {
        return this._date;
    }

    getYear=():string=>
    {
        return this._date.length>0?moment(this._date).format('YYYY'):'';
    }
    getMonth=(long?:boolean):string=>
    {
        if(this._date.length<1) return '';
        const mom=moment(this._date);
        return long?mom.format('MMM'):mom.format('MM');
    }
    getDate=():string=>
    {
        return this._date.length>0?moment(this._date).format('DD'):'';
    }

    testMoment=()=>
    {
        const values:any[]=[
            '',
            null,
            undefined,
            '03',
            '2024',
            '2024-03',
            '2024-31-13',
            '0000-00-00',
            '2024-5-1',
        ];
        const format='YYYY-MM-DD';
        console.log("---------start mom")
        for(let i=0; i<values.length; i++)
        {
            const valueA=values[i];
            const mo=moment(valueA);
            const valueB=mo.isValid()?mo.format(format):'';
            console.log(valueA,' is ',valueB);
        }
        console.log('------------end mom');
    }
}

export default InputTrack;