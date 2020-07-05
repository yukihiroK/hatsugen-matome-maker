export class SentenceLayoutElement{
    texts:string[]; // 横向きLtRのデータを格納する。
    x:number; // 横書きの場合、原点は左上。縦書きの場合、右上。
    y:number;
    size:number;
    isVertical:boolean;
    //isBold:boolean;

    constructor(texts:string[],x:number,y:number,size:number,isVertical:boolean=false,/*isBold:boolean=false*/){
        this.texts=texts;
        this.x=Math.max(0,x);
        this.y=Math.max(0,y);
        this.size=Math.max(1,size);
        this.isVertical=isVertical;
        //this.isBold=isBold;
    }

    getLayout=()=>{
        const layout=[];
        if(this.isVertical){
            
            for(let i=0;i<this.texts.length;i++){
                for(let j=0;j<this.texts[i].length;j++){
                    layout.push({
                        text: this.texts[i][j],
                        x: Math.max(0, this.x - (i+0.5)*this.size), // TextAlign right -> center
                        y: this.y + (j+0.5)*this.size, // baseline top -> middle
                        maxWidth: this.size
                    });
                }

            }
        }else{
            for(let i=0;i<this.texts.length;i++){
                layout.push({
                    text: this.texts[i],
                    x: this.x, // TextAlign start
                    y: this.y + (i+0.5)*this.size, // baseline top -> middle
                    maxWidth: this.texts[i].length*this.size
                });
            }
        }
        return layout;
    }

    static verticalArray=(texts:string[]):string[]=>{ // 横書き文字列配列を縦書き用に変換する。
        
      const maxLength=texts.reduce((acc,cur)=>Math.max(acc,cur.length),0);
      const vertical:string[]=Array(maxLength).fill("");
      const reversed = texts.reverse();
      reversed.forEach((text)=>{
        for(let i=0;i<text.length;i++){
            vertical[i]+=text[i];
        }
      });

      return vertical;
    }
}