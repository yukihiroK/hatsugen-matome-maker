import React, { useEffect, useState } from 'react';
import { Layout } from './util/layout';
import "./css/image.css";
import WebFont from 'webfontloader'
import TextProps from './util/text_props';


interface props{
    texts:TextProps[],
    width:number;
    height:number;
    backgroundColor?:string;
    color?:string;
    divider?:number
    seed?:number;
}

const Renderer:React.FC<props>=({texts, width, height, backgroundColor='white',color='black',divider=5, seed=1234567})=>{
    const [image,setImage]=useState<string|undefined>(undefined);

    useEffect(()=>{
        const canvas=document.createElement("canvas");
        canvas.width=width;
        canvas.height=height;

        const context=canvas.getContext("2d");

        if(context){
            
            const families:string[] = [];
            texts.forEach((t)=>{
                if(!families.includes(`${t.fontName}:400,700`)){
                    families.push(`${t.fontName}:400,700`);
                    families.push(`${t.fontName} Vertical:400,700`);
                }
            });

            WebFont.load({
                custom:{
                    families:families,
                    urls:['./css/fonts.css'],
                },
                active:()=>{
                    draw(context);
                    setImage( canvas.toDataURL() );
                },
            });

        }
    });
    


    const draw=(context:CanvasRenderingContext2D)=>{
        context.fillStyle=backgroundColor;
        context.fillRect(0,0,width,height);

        const placeholder= {x:(width-300)/divider ,y:(height-30)/divider, width:300/divider, height:30/divider};
        context.font="30px 'M PLUS Rounded 1c', sans-serif";
        //context.fillStyle = "rgba(29, 161, 242, 0.5)";
        //context.fillRect(width-305, height-35, 305, 35);
        context.fillStyle="gray";//"rgb(29, 161, 242)";
        context.textAlign="end";
        context.textBaseline="bottom";
        context.fillText("#発言まとめメーカー",width,height);

        const layout = new Layout(width/divider, height/divider, seed, texts.map(t=>t.text), placeholder);
        //layout.logMap();

        context.textBaseline="middle";
        context.fillStyle=color;

        layout.sentences.forEach((sentence,i)=>{
            context.textAlign=sentence.isVertical?"center":"left";

            const style=`${texts[i].isItalic?"italic ":""}${texts[i].isBold?"bold ":""}`;
            const font = `${sentence.isVertical?`'${texts[i].fontName} Vertical', `:""}` + `'${texts[i].fontName}', 'Yu Mincho', 'Hiragino Mincho ProN', serif`;
            context.font=`${style}${divider*sentence.size}px ${font}`;
            
            const lyts = sentence.getLayout();
            lyts.forEach((lyt)=>{
                context.fillText(lyt.text, divider*lyt.x, divider*lyt.y, divider*lyt.maxWidth);
            });
        });

    }



    return (<img alt="画像を生成中です。しばらく経っても画像が表示されない場合は、お使いのブラウザがWebフォントに対応していない可能性があります。" src={image}/>);
    
}

export default Renderer;