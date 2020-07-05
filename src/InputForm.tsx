import React from 'react';
import { TextField, Grid, Paper, Box, Fab, Button, Divider, Tabs, Tab, Select, MenuItem, InputLabel, FormControl, FormControlLabel, Checkbox, FormGroup, Popover, Typography, } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import TextProps from './util/text_props';
import { XorShift32 } from './util/xorshift32';
import Brightness1Icon from '@material-ui/icons/Brightness1';

interface color{
    name:string,
    value:string
}

const COLORS:color[]=[
    {name:'透明',value:'rgba(0,0,0,0)'},
    {name:'白',value:'white'},
    {name:'銀色',value:'silver'},
    {name:'灰色',value:'gray'},
    {name:'黒',value:'black'},
    {name:'赤',value:'red'},
    {name:'マルーン',value:'maroon'},
    {name:'黄色',value:'yellow'},
    {name:'オリーブ',value:'olive'},
    {name:'ライム',value:'lime'},
    {name:'緑',value:'green'},
    {name:'水色',value:'aqua'},
    {name:'ティール',value:'teal'},
    {name:'青',value:'navy'},
    {name:'ネイビー',value:'aqua'},
    {name:'フクシャ',value:'fuchsia'},
    {name:'紫',value:'purple'},
]



interface InputFormProps{
    onSubmit:(n:number,t:TextProps[],bgc:string,c:string)=>void,
}

interface InputFormState{
    seed:number,
    textprops:TextProps[],
    isAdvanced:boolean,
    backgroundColor:color,
    color:color,
}

class InputForm extends React.Component<InputFormProps,InputFormState>{

    constructor(props:InputFormProps){
        super(props);

        this.state={
            textprops:[new TextProps(""),new TextProps(""),new TextProps("")],
            seed:Date.now(),
            isAdvanced:false,
            backgroundColor: COLORS[1],//'white',
            color:COLORS[4],
        }
    }

    handleInputChange=(i:number,text:string)=>{
        const newTp=this.state.textprops.slice();
        newTp[i].text=text;
        this.setState({textprops:newTp});
    }

    handleSeedChange=(seed:string)=>{
        const seedNum=parseInt(seed);
        this.setState({seed:Number.isNaN(seedNum) ?Date.now() :seedNum});
    }

    handleTabChange=(event:React.ChangeEvent<{}>,value:number)=>{
        this.setState({isAdvanced:(value===1)});
    }

    handleFontChange=(i:number, fontNum:number)=>{
        const props = this.state.textprops.slice();
        props[i].fontNum=fontNum;
        this.setState({textprops:props});
    }

    handleWeightChange=(i:number, weight:number)=>{
        const props = this.state.textprops.slice();
        props[i].weight=weight;
        this.setState({textprops:props});
    }

    handleIsItalicChange=(i:number, isItalic:boolean)=>{
        const props = this.state.textprops.slice();
        props[i].isItalic=isItalic;
        this.setState({textprops:props});
    }




    handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();

        const texts=this.state.textprops.map((t)=>t.text);
        const sum = texts.reduce((acc,cur)=>acc+cur.length,0);

        let tp:TextProps[]=[];
        let c=this.state.color.value;
        let bcg=this.state.backgroundColor.value;

        const rand=new XorShift32(this.state.seed);

        tp=this.state.textprops.slice();
        if(!this.state.isAdvanced){
            tp.forEach((t)=> {
                t.fontNum=0;
                t.isItalic=false;
                t.weight=(rand.rand()%3===0)?700:400;
            });
            c='black';
            bcg='white';
        }

        if(sum===0){
            tp=[];
            for(let i=0;i<100;i++)tp.push(new TextProps("発言を入力してください",0,rand.rand()%3===0));
        }

        this.props.onSubmit(this.state.seed,tp,bcg,c);

    }



    updateSeed=()=>{
        this.setState({seed:Date.now()});
    }

    addTextArea=()=>{
        if(this.state.textprops.length<100){
            this.setState({textprops:[...this.state.textprops,new TextProps("")]});
        }
    }





    renderBasicTextArea=(i:number)=>{
        return (
        <Grid item key={`${i}`} xs={12} sm={6}>
            <Paper elevation={3}>
                <Box padding={2}>
                    <TextField color='secondary' label={`発言 ${i+1}`} multiline fullWidth value={this.state.textprops[i].text} onChange={(e) => this.handleInputChange(i,e.target.value)}/>
                </Box>
            </Paper>
        </Grid>);
        //return (<p key={i}><label>{`発言${i+1} : `}<textarea value={this.state.texts[i]} onChange={(e) => this.handleChange(i,e.target.value)} /></label></p>);
    }


    renderAdvancedTextArea=(i:number)=>{
        return (
            <Grid item key={`${i}`} xs={12} sm={6}>
                <Paper elevation={3}>
                    <Box padding={2}>
                        <FormControl>
                        <InputLabel color='secondary' >フォント</InputLabel>
                        <Select color='secondary' displayEmpty value={this.state.textprops[i].fontName} renderValue={(value:any)=>{return this.state.textprops[i].fontName}} onChange={(event)=>this.handleFontChange(i,event.target.value as number)}>
                            {TextProps.fontList.map((font,index)=><MenuItem value={index} key={index}>{font}</MenuItem>)}
                        </Select>
                        <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox checked={this.state.textprops[i].isBold} onChange={(event,checked)=>this.handleWeightChange(i,checked?700:400)} />}
                            label="太字"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={this.state.textprops[i].isItalic} onChange={(event,checked)=>this.handleIsItalicChange(i,checked)} />}
                            label="斜体"
                        />
                        </FormGroup>
                        </FormControl>
                        <TextField color='secondary' label={`発言 ${i+1}`} multiline fullWidth value={this.state.textprops[i].text} onChange={(e) => this.handleInputChange(i,e.target.value)}/>
                    </Box>
                </Paper>
            </Grid>);
    }

/*
    renderColorChangers=()=>{
        return(
            <Grid item xs={12}>
            <Grid container direction='row' spacing={2} alignItems="center" justify="center">
            <Grid item xs>
                <InputLabel>背景色</InputLabel>
                <ChromePicker color={this.state.backgroundColor} onChange={(color)=>this.setState({backgroundColor:color.rgb})}/>
            </Grid>
            <Grid item xs>
                <InputLabel>背景色</InputLabel>
                <ChromePicker color={this.state.backgroundColor} onChange={(color)=>this.setState({backgroundColor:color.rgb})}/>
            </Grid>
            </Grid></Grid>
        );
    }*/

    colorSelects=()=>{
        return(
        <Grid item xs={12}>
            <Paper elevation={3}>
                <Box padding={2}>
                    <FormControl>       
                        <InputLabel color='secondary' >背景色</InputLabel>
                        <Select style={{minWidth:100}} autoWidth color='secondary' displayEmpty value={this.state.backgroundColor.name} renderValue={(value:any)=>{return this.state.backgroundColor.name}} onChange={(event)=>this.setState({backgroundColor:COLORS[event.target.value as number]})}>
                            {COLORS.map((color,index)=><MenuItem value={index} key={index}><Brightness1Icon fontSize='small' style={{color:color.value}}/>{color.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl>       
                        <InputLabel color='secondary' >文字色</InputLabel>
                        <Select style={{minWidth:100}} autoWidth color='secondary' displayEmpty value={this.state.color.name} renderValue={(value:any)=>{return this.state.color.name}} onChange={(event)=>this.setState({color:COLORS[event.target.value as number]})}>
                            {COLORS.map((color,index)=><MenuItem value={index} key={index}><Brightness1Icon fontSize='small' style={{color:color.value}}/>{color.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
            </Paper>
        </Grid>);
    }


    render=()=>{
        const textAreas=[];
        for(let i:number=0;i<this.state.textprops.length;i++) textAreas.push((this.state.isAdvanced)?this.renderAdvancedTextArea(i):this.renderBasicTextArea(i));


        return (
                <form onSubmit={this.handleSubmit}>
                    <Grid container spacing={2} alignItems="center" justify="flex-start">
                        <Grid item xs={12}><Paper><Tabs centered value={this.state.isAdvanced?1:0} onChange={this.handleTabChange}>
                            <Tab label='Basic'/>
                            <Tab label='Advanced'/>
                        </Tabs></Paper></Grid>
                        {(!this.state.isAdvanced)?null:this.colorSelects()}
                        {textAreas}
                    </Grid>
                    <Box　display="flex" justifyContent='center' margin={2}>
                        <Fab size="medium" color='secondary' aria-label="add" onClick={this.addTextArea}><AddIcon/></Fab>
                    </Box>
                    <Divider variant='middle'/>
                    <Box　display="flex" justifyContent='center' padding={2}>
                        <TextField type='number' label="シード値" color='secondary' value={this.state.seed} onChange={(e) => this.handleSeedChange(e.target.value)}/>
                        <Button color="secondary" onClick={this.updateSeed}>更新</Button>
                        <Button variant="contained" color="primary" type="submit">作成</Button>
                    </Box>
                    
                </form>
        );
    }

}

export default InputForm;