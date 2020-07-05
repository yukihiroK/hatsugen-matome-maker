class TextProps {

    text:string
    weight:number;
    isItalic:boolean;
    fontNum:number;

    static readonly fontList:ReadonlyArray<string>=[
        'Noto Serif JP',
        'Noto Sans JP',
        'M PLUS Rounded 1c',
    ];

    constructor(text:string,fontNum:number=0,isBold:boolean=false,weight:number=400,isItalic:boolean=false){
        this.text=text;
        this.fontNum=fontNum;
        this.weight=(isBold)?700 :weight;
        this.isItalic=isItalic;
    }

    get isBold():boolean{
        return (this.weight===700);
    }

    get fontName():string{
        return TextProps.fontList[this.fontNum];
    }

}

export default TextProps;