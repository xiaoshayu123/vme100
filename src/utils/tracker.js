
class SendTracker{
    constructor()
    {
        this.url='';
        this.xhr=new XMLHttpRequest;
    }
    send(data={}){
        console.log(data);
    }
}

export default new SendTracker()