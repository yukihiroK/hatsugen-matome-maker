import { XorShift32 } from './xorshift32';
import {SentenceLayoutElement} from './sentence_layout_element'

interface placeholder{
    x:number,
    y:number,
    width:number,
    height:number
}

export class Layout{

    sentences:SentenceLayoutElement[];

    rand:XorShift32;



    width:number;
    height:number;

    availabilityMap:boolean[][];//  indices[y][x]


    
    emptyNum:number;
    emptyNumRow:number[];// eNumRow[y]
    emptyNumColumn:number[];// eNumCol[x]

    //statements:string[][];
    remainingCharNum:number;
    


    constructor(width:number,height:number,seed:number,statements:string[],placeholder:placeholder={x:0,y:0,width:0,height:0}){
        this.width=width;
        this.height=height;

        this.availabilityMap=[];
        for(let i:number=0;i<height;i++){
            this.availabilityMap.push(new Array(width).fill(true));
        }

        this.emptyNum=width*height;
        this.emptyNumRow=new Array(height).fill(width);
        this.emptyNumColumn=new Array(width).fill(height);


        this.setPlaceholder(placeholder); // placeholder の領域を確保する。



        this.rand=new XorShift32(seed);

        this.sentences = statements.filter( (text:string) => !(text.length===0) )
            .map((text:string) => new SentenceLayoutElement(text.split(/\r\n|\r|\n/),0,0,1));

        const splitedTexts = statements.map((statement:string) => statement.split(/\r\n|\r|\n/));
        this.remainingCharNum = splitedTexts.reduce((acc,cur)=> acc + cur.reduce((a,c) => a+c.length,0), 0)

        this.makeLayout();
    }


    setPlaceholder=(placeholder:placeholder)=>{
        const x=Math.round(placeholder.x);
        const y=Math.round(placeholder.y);
        const width=Math.round(placeholder.width);
        const height=Math.round(placeholder.height);

        let posX:number;
        let posY:number;

        for(let dx=0;dx<width;dx++){
            for(let dy=0;dy<height;dy++){

                if(x+dx<0)posX=0;
                else if(x+dx>=this.width)posX=this.width-1;
                else posX=x+dx;

                if(y+dy<0)posY=0;
                else if(y+dy>=this.height)posY=this.height-1;
                else posY=y+dy;

                if(this.availabilityMap[posY][posX]){
                    this.availabilityMap[posY][posX]=false;

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[posY]--;
                    this.emptyNumColumn[posX]--;
                }
            }
        }
    }


    makeLayout=()=>{
        this.sentences.forEach((sentence)=>{
            this.locateSentence(sentence);
            sentence.isBold=(this.rand.rand()%3===0); // 1/3で太字
            //console.log(`${sentence.texts}\nX: ${sentence.x} Y: ${sentence.y}\nSize: ${sentence.size} IsVertical: ${sentence.isVertical}\n`);
            //console.log(`${SentenceLayoutElement.verticalArray(sentence.texts).map((t)=>t+"\n")}\n`);
        });
    }




    locateSentence=(sentence:SentenceLayoutElement)=>{

        let sizeFactor:number = Math.floor( Math.sqrt(this.emptyNum/this.remainingCharNum) );
        const isVertical=(this.rand.rand()%3===0) // 1/3 で縦書き

        while(sizeFactor>0){
            if(isVertical){ // 縦書きモード
                const vLocation=this.findVerticalLocation(sentence.texts,sizeFactor);
                if(vLocation.anchorX!==-1||vLocation.anchorY!==-1){
                    sentence.x=vLocation.anchorX;
                    sentence.y=vLocation.anchorY;
                    sentence.isVertical=true;
                    break;
                }

            }else{ // 横書きモード
                const hLocation=this.findHorizontalLocation(sentence.texts,sizeFactor);
                if(hLocation.anchorX!==-1||hLocation.anchorY!==-1){
                    sentence.x=hLocation.anchorX;
                    sentence.y=hLocation.anchorY;
                    break;
                }
            }
            
            sizeFactor--;
        }

        sentence.size=sizeFactor;
        if(sentence.isVertical)this.updateAvailabilityVertically(sentence);
        else this.updateAvailabilityHorizontally(sentence);
    }




    findHorizontalLocation=(texts:string[],sizeFactor:number)=>{
        //console.log(`findLocation called : sizeFactor is ${sizeFactor}`);
        const wNeeds:number[] = texts.map((text)=>sizeFactor*text.length);
        const wNeedsMax=wNeeds.reduce((acc,cur)=>Math.max(acc,cur));
        if(wNeedsMax>this.width)return {anchorX:-1,anchorY:-1};

        const candidatesRowAnchors:number[]=[];// 候補地の行番号配列
        const checkRangeY=1 + this.emptyNumRow.length - sizeFactor*wNeeds.length;
        //console.log(`wNeeds is ${wNeeds}`);
        //console.log(`checkRangeY : 0 ~ ${checkRangeY-1}`);
        for(let y=0;y<checkRangeY;y++){ // y を動かす。

            let available:boolean=true;

            for(let i=0;i<wNeeds.length;i++){

                for(let j=0;j<sizeFactor;j++){
                    const row=y+ i*sizeFactor +j;
                    if(row>=this.emptyNumRow.length || this.emptyNumRow[row] < wNeeds[i] ){
                        available=false;
                        break;
                    }
                }
                if(!available)break;
            }

            if(available)candidatesRowAnchors.push(y);// Anchor Y の候補
        }

        let anchorX:number=-1;
        let anchorY:number=-1;

        const candidatesNum=candidatesRowAnchors.length
        //console.log(`candidates : ${candidatesNum}`);

        for(let num=0;num<candidatesNum;num++){

            const checkRangeX=1 + this.width - wNeedsMax;


            const candidateIndex = this.rand.randInt(0,candidatesRowAnchors.length-1);
            const offsetY=candidatesRowAnchors[candidateIndex]; // Anchor Y 候補を一つ選ぶ。

            const startX=this.rand.randInt(0,checkRangeX-1); // Anchor X 走査の開始点。
            for(let i=0;i<checkRangeX;i++){
                const offsetX=(i+startX)%checkRangeX; // 乱数に基づく開始点から Anchor X を動かす。
                let available:boolean=true;

                for(let j=0;j<wNeeds.length;j++){

                    for(let k=0;k<sizeFactor;k++){
                        const dy=j*sizeFactor +k;// y を動かす。
                        for(let dx=0;dx<wNeeds[j];dx++){// x を動かす。
                            if(! this.availabilityMap[offsetY+dy][offsetX+dx]){// 既に埋まっているか(false)判定。
                                available=false;
                                break;
                            }
                        }
                        if(!available)break;
                    }
                    if(!available)break;
                }

                if(available){ // 利用可能であればその位置を記録し終了。
                    anchorX=offsetX;
                    anchorY=offsetY;
                    break;
                }
            }
            if(anchorX===-1&&anchorY===-1){ // 利用不可能だった場合、候補地から除く。
                candidatesRowAnchors.splice(candidateIndex,1);
                //console.log(`candidate ${candidateIndex} is not available.`)
            }else{
                //console.log("break");
                break;
            }
        }

        return {anchorX,anchorY};
        
    }

    updateAvailabilityHorizontally=(sentence:SentenceLayoutElement)=>{

        const wNeeds:number[] = sentence.texts.map((text)=>sentence.size*text.length);

        for(let i=0;i<wNeeds.length;i++){

            for(let j=0;j<sentence.size;j++){
                const dy=i*sentence.size +j;// y を動かす。

                for(let dx=0;dx<wNeeds[i];dx++){// x を動かす。
                    this.availabilityMap[sentence.y+dy][sentence.x+dx]=false; // 値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[sentence.y+dy]--;
                    this.emptyNumColumn[sentence.x+dx]--;

                }
            }
        }



        // 周囲１マスずつマージンを確保する。

        for(let i=0;i<wNeeds.length;i++){ // 左右マージン

            for(let j=0;j<sentence.size;j++){
                const dy=i*sentence.size +j;// y を動かす。
                const left=Math.max(0, sentence.x-1);
                const right=Math.min(this.width-1, sentence.x+wNeeds[i]);

                if(this.availabilityMap[sentence.y+dy][left]){
                    this.availabilityMap[sentence.y+dy][left]=false; // 左マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[sentence.y+dy]--;
                    this.emptyNumColumn[left]--;

                }
                if(this.availabilityMap[sentence.y+dy][right]){
                    this.availabilityMap[sentence.y+dy][right]=false; // 右マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[sentence.y+dy]--;
                    this.emptyNumColumn[right]--;

                }


            }
        }

        for(let i=0;i<wNeeds.length;i++){ // 上下マージン

            for(let dx=0;dx<wNeeds[i];dx++){// x を動かす。
                const top=Math.max(0, sentence.y + i*sentence.size-1);
                const bottom=Math.min(this.height-1, sentence.y + (i+1)*sentence.size);

                if(this.availabilityMap[top][sentence.x+dx]){
                    this.availabilityMap[top][sentence.x+dx]=false; // 上マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[top]--;
                    this.emptyNumColumn[sentence.x+dx]--;

                }
                if(this.availabilityMap[bottom][sentence.x+dx]){
                    this.availabilityMap[bottom][sentence.x+dx]=false; // 下マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[bottom]--;
                    this.emptyNumColumn[sentence.x+dx]--;

                }

            }
        }

        this.remainingCharNum-=sentence.texts.reduce((acc,cur)=> acc + cur.length,0); // 配置した文字数を引く。
    }





    findVerticalLocation=(texts:string[],sizeFactor:number)=>{
        const hNeeds:number[] = texts.map((text)=>sizeFactor*text.length);
        const hNeedsMax=hNeeds.reduce((acc,cur)=>Math.max(acc,cur));

        if(hNeedsMax>this.height)return {anchorX:-1,anchorY:-1};

        const candidatesColumnAnchors:number[]=[];// 候補地の列番号配列
        const checkRangeX= sizeFactor*hNeeds.length -1; // 走査領域の左端
        //console.log(`texts: ${texts}\nsizeFactor: ${sizeFactor}`);
        //console.log(`hNeeds: ${hNeeds}`);
        //console.log(`checkRangeX: ${checkRangeX} - ${this.emptyNumColumn.length}`);
        for(let x=this.emptyNumColumn.length;x >= checkRangeX;x--){ // x を右から左へ動かす。[checkRangeX, Width]

            let available:boolean=true;

            for(let i=0;i<hNeeds.length;i++){

                for(let j=0;j<sizeFactor;j++){
                    const column=x - i*sizeFactor - j;
                    if(column<checkRangeX || this.emptyNumColumn[column] < hNeeds[i] ){
                        available=false;
                        break;
                    }
                }
                if(!available)break;
            }

            if(available)candidatesColumnAnchors.push(x);// Anchor X の候補 TOP RIGHT
        }

        let anchorX:number=-1;
        let anchorY:number=-1;

        const candidatesNum=candidatesColumnAnchors.length
        //console.log(`candidates: ${candidatesNum}`);

        for(let num=0;num<candidatesNum;num++){

            const checkRangeY=1 + this.height - hNeedsMax;


            const candidateIndex = this.rand.randInt(0,candidatesColumnAnchors.length-1);
            const offsetX=candidatesColumnAnchors[candidateIndex]; // Anchor X 候補を一つ選ぶ。

            const startY=this.rand.randInt(0,checkRangeY-1); // Anchor Y 走査の開始点。
            for(let i=0;i<checkRangeY;i++){
                const offsetY=(i+startY)%checkRangeY; // 乱数に基づく開始点から Anchor X を動かす。
                let available:boolean=true;

                for(let j=0;j<hNeeds.length;j++){

                    for(let k=0;k<sizeFactor;k++){
                        const dx= -j*sizeFactor -k;// x を動かす。
                        for(let dy=0;dy<hNeeds[j];dy++){// y を動かす。
                            if(offsetX+dx<0 || !this.availabilityMap[offsetY+dy][offsetX+dx]){// 既に埋まっているか(false)判定。
                                available=false;
                                break;
                            }
                        }
                        if(!available)break;
                    }
                    if(!available)break;
                }

                if(available){ // 利用可能であればその位置を記録し終了。
                    anchorX=offsetX;
                    anchorY=offsetY;
                    break;
                }
            }
            if(anchorX===-1&&anchorY===-1){ // 利用不可能だった場合、候補地から除く。
                candidatesColumnAnchors.splice(candidateIndex,1);
                //console.log(`candidate ${candidateIndex} is not available.`)
            }else{
                //console.log("break");
                break;
            }
        }
        //console.log(`anchorX:${anchorX}, anchorY:${anchorY}`);
        return {anchorX,anchorY};
        
    }

    updateAvailabilityVertically=(sentence:SentenceLayoutElement)=>{
        const hNeeds:number[] = sentence.texts.map((text)=>sentence.size*text.length);

        for(let j=0;j<hNeeds.length;j++){

            for(let k=0;k<sentence.size;k++){
                const dx= -j*sentence.size -k;// x を動かす。

                for(let dy=0;dy<hNeeds[j];dy++){// y を動かす。
                    this.availabilityMap[sentence.y+dy][sentence.x+dx]=false;

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[sentence.y+dy]-=1;
                    this.emptyNumColumn[sentence.x+dx]-=1;
                }
            }
        }



        // 周囲１マスずつマージンを確保する。

        for(let i=0;i<hNeeds.length;i++){ // 上下マージン

            for(let j=0;j<sentence.size;j++){
                const dx= -i*sentence.size -j;// x を動かす。
                const top=Math.max(0, sentence.y-1);
                const bottom=Math.min(this.height-1, sentence.y+hNeeds[i]);

                if(this.availabilityMap[top][sentence.x+dx]){
                    this.availabilityMap[top][sentence.x+dx]=false; // 左マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[top]--;
                    this.emptyNumColumn[sentence.x+dx]--;

                }
                if(this.availabilityMap[bottom][sentence.x+dx]){
                    this.availabilityMap[bottom][sentence.x+dx]=false; // 右マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[bottom]--;
                    this.emptyNumColumn[sentence.x+dx]--;

                }


            }
        }

        for(let i=0;i<hNeeds.length;i++){ // 左右マージン

            for(let dy=0;dy<hNeeds[i];dy++){// y を動かす。
                const right=Math.min(this.width-1, sentence.x - i*sentence.size +1);
                const left=Math.max(0, sentence.x - (i+1)*sentence.size);

                if(this.availabilityMap[sentence.y+dy][right]){
                    this.availabilityMap[sentence.y+dy][right]=false; // 右マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[sentence.y+dy]--;
                    this.emptyNumColumn[right]--;

                }
                if(this.availabilityMap[sentence.y+dy][left]){
                    this.availabilityMap[sentence.y+dy][left]=false; // 左マージンの値を更新する。

                    this.emptyNum--; // 空き数を更新する。
                    this.emptyNumRow[sentence.y+dy]--;
                    this.emptyNumColumn[left]--;

                }

            }
        }



        this.remainingCharNum-=sentence.texts.reduce((acc,cur)=> acc + cur.length,0); // 配置した文字数を引く。

    }




}


