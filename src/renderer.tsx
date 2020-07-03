import React, { useEffect, useState } from 'react';
import { Layout } from './util/layout';
import "./css/image.css";
import WebFont from 'webfontloader'
import { Typography } from '@material-ui/core';


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
            
            WebFont.load({
                custom:{
                    families:['Noto Serif JP:500,700','Noto Serif JP Vertical:500,700'],
                    urls:['./css/fonts.css']
                },
                active:()=>{
                    draw(context);
                    setImage( canvas.toDataURL() );
                },
            });

        }
    });
    


    const draw=(context:CanvasRenderingContext2D)=>{
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
        //layout.logMap();

        context.textBaseline="middle";
        context.fillStyle="black";

        layout.sentences.forEach((sentence)=>{
            context.textAlign=sentence.isVertical?"center":"left";

            const thickness=sentence.isBold?"bold ":"";
            const font = `${sentence.isVertical?"'Noto Serif JP Vertical', ":""}'Noto Serif JP', 'Yu Mincho', 'Hiragino Mincho ProN', serif`;
            context.font=`${thickness}${divider*sentence.size}px ${font}`;
            
            const lyts = sentence.getLayout();
            lyts.forEach((lyt)=>{
                context.fillText(lyt.text, divider*lyt.x, divider*lyt.y, divider*lyt.maxWidth);
            });                
        });

    }



    return (<img alt="お使いのブラウザはWebフォントに対応していません。" src={image}/>);
    
}

export default Renderer;