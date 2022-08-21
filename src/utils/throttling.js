export default function throttling(fn,interal)
{
    let timer=null
    return ()=>
    {
        if(timer)return ;
        timer=setInterval(fn,interal)
    }
}