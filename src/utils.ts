import moment from "moment";

export function randomString(prefix?:string):string
{
    prefix=prefix?prefix:'ipt';
    return (prefix+Math.random().toString(32)+Date.now().toString(32)).replace(/\./g,'');
}

export function getElementAttr(element:HTMLElement|Element|undefined|null,attr:string):string
{
    const yes_element=element && ((element instanceof HTMLElement) || (element instanceof Element));
    if(!yes_element) return '';
    return element.getAttribute(attr)||'';
}

export function getFocusElement()
{
    return document && document.activeElement;
}

export function getArgsTypeOf(val:any):string[]
{
    const types:string[]=[];

    const p=(name:string)=>{ types.push(name); }
    if(val===null) p('null');
    else
    if(val===undefined) p('undefined');
    else
    if(Array.isArray(val)) p('array');
    else
    if(['bigint','number'].indexOf(typeof val)) p('number');
    else
    if(typeof val==='boolean') { p('boolean'); p('bool'); }
    else 
    if(typeof val==='object') p('object');

    return types;
}
export function getTypeOf(val:any,args:string|string[]):boolean
{
    const gars:string[]=Array.isArray(args)?args:[args];
    let types:string[]=getArgsTypeOf(val);
    let yes:boolean=false;
    for(let i=0; i<gars.length; i++)
    {
        yes=types.indexOf(args[i])>=0;
        if(yes) break;
    }
    return yes;
}

export function stringToDateCorrectFull(year:any,month:any,date:any,format_system:string='YYYY-MM-DD'):string
{
    let valYear:string=getTypeOf(year,['string','number'])?year.toString().trim():'';
    let valMonth:string=getTypeOf(month,['string','number'])?month.toString().trim():'';
    let valDate:string=getTypeOf(date,['string','number'])?date.toString().trim():'';
    const joins=[valYear,valMonth,valDate].join('');
    if(joins.length<1) return '';

    const fms:string[]=[];
    const values:string[]=[];
    const condi=(value:string,format:string):boolean=>{
        if(value.length>0)
        {
            fms.push(format);
            values.push(value);
            return true;
        }
        return false;
    };

    const strToMonth=(val:string):string=>
    {
        if(val.length<1) return '';
        let test:number=parseInt(val);
        if(isNaN(test)) return  '';
        test=test<1?1:test>12?12:test;
        return test<10?'0'+test.toString():test.toString();
    };

    const strToDate=(val:string):string=>
    {
        if(val.length<1) return '';
        let test:number=parseInt(val);
        if(isNaN(test)) return  '';
        test=test<1?1:test>31?31:test;
        return test<10?'0'+test.toString():test.toString();
    };

    if(condi(valYear,'YYYY'))
    {
        if(condi(strToMonth(valMonth),'MM'))
        {
            condi(strToDate(valDate),'DD');
        }
    }
    const mom=moment(values.join('-'));
    const valid=mom.isValid();
    return valid?mom.format(format_system):'';
}

export function unzero(value:any,length:number,separator:string):string
{
    const yesval=value!==undefined && value!==null && (typeof value==="string" || typeof value==="number");
    if(!yesval) return "";
    if(length<1 || separator===' ' || separator.length<1) return value as string;

    let val=value.toString().trim();
    while (val.length<length)
    {
        val=separator+val;
    }
    return val;
}

// get document|input caret position
// ref : https://stackoverflow.com/questions/2897155/get-cursor-position-in-characters-within-a-text-input-field
export function getDocumentCaretPosition(oField:HTMLElement)
{
    const is_input_element=(oField instanceof HTMLElement)  
            && ("value" in oField)
            && ("selectionStart" in oField)
            && ("selectionDirection" in oField)
            && ("selectionEnd" in oField)
            ;

    if(!is_input_element) return 0;

    // Initialize
    let iCaretPos :number = 0;

    // IE Support
    if ((document as any).selection) {

        // Set focus on the element
        oField.focus();

        // To get cursor position, get empty selection range
        let oSel = (document as any).selection.createRange();

        // Move selection start to 0 position
        oSel.moveStart('character', - (oField as HTMLInputElement).value.length);

        // The caret position is selection length
        iCaretPos = oSel.text.length as number;
    }

    // Firefox support
    else if (oField.selectionStart || oField.selectionStart == '0')
    {
        iCaretPos = (oField.selectionDirection=='backward' ? oField.selectionStart : oField.selectionEnd) as number;
    }

    // Return results
    return iCaretPos;
}