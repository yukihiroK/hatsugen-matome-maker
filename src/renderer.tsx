import React, { useEffect, useState } from 'react';
import { Layout } from './util/layout';
import "./css/image.css";


interface props{
    statements:string[];
    width:number;
    height:number;
    divider?:number
    seed?:number;
}

const Renderer:React.FC<props>=({statements, width, height, divider=5, seed=1234567})=>{
    const [image,setImage]=useState<string|undefined>(undefined);

    useEffect(()=>{
        const canvas=document.createElement("canvas");
        canvas.width=width;
        canvas.height=height;

        const context=canvas.getContext("2d");

        if(context){
            context.fillStyle="white";
            context.fillRect(0,0,width,height);

            const placeholder= {x:(width-300)/divider ,y:(height-30)/divider, width:300/divider, height:30/divider};
            context.font="30px 'M PLUS Rounded 1c', sans-serif";
            //context.fillStyle = "rgba(29, 161, 242, 0.5)";
            //context.fillRect(width-305, height-35, 305, 35);
            context.fillStyle="gray";//"rgb(29, 161, 242)";
	        context.textAlign="end";
            context.textBaseline="bottom";
            context.fillText("#発言まとめメーカー",width,height);

            const layout = new Layout(width/divider, height/divider, seed, statements, placeholder);


            context.textAlign="start";
	        context.textBaseline="top";
            context.fillStyle="black";
            layout.sentences.forEach((sentence)=>{
                const thickness=sentence.isBold?"bold ":"";
                const font = `${sentence.isVertical?"'Noto Serif JP Vertical', ":""}'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', serif`;
                context.font=`${thickness}${divider*sentence.size}px ${font}`;
                const lyts = sentence.getLayout();
                lyts.forEach((lyt)=>{
                    context.fillText(lyt.text, divider*lyt.x, divider*lyt.y, divider*lyt.maxWidth);
                });                
            });




            setImage(canvas.toDataURL())
        }
    });
    

    return (<img alt="" src={image}/>);
    
}

export default Renderer;