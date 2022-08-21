export default function(target)
{
    if(typeof target =='undefined')return '';
    let result=target.path.reverse().slice(2).map(element=>{
           if(element.id)
           {
            return `${element.tagName.toLowerCase()}#${element.id}`
           }else if(element.className &&typeof element.className==='string')
           {
            return `${element.tagName.toLowerCase()}.${element.className}`
           }else
           {
            return `${element.nodeName.toLowerCase()}`
           }
    }).join(' ')
    return result
}