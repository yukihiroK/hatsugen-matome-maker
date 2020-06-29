import React from 'react';
import { TextField, Grid, Paper, Box, Fab, Button, Divider } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

interface InputFormProps{
    onSubmit:(n:number, s:string[])=>void,
}

interface InputFormState{
    seed:number,
    texts:string[],
}

class InputForm extends React.Component<InputFormProps,InputFormState>{

    constructor(props:InputFormProps){
        super(props);

        this.state={texts:["","",""], seed:Date.now()}
    }

    handleChange=(i:number,statement:string)=>{
        const newTexts=this.state.texts.slice();
        newTexts[i]=statement;
        this.setState({texts:newTexts});
    }

    handleSeedChange=(seed:string)=>{
        const seedNum=parseInt(seed);
        this.setState({seed:Number.isNaN(seedNum) ?Date.now() :seedNum});
    }

    handleSubmit=(event:React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault();
        this.props.onSubmit(this.state.seed,this.state.texts);
    }

    updateSeed=()=>{
        this.setState({seed:Date.now()});
    }

    addTextArea=()=>{
        if(this.state.texts.length<100){
            this.setState({texts:[...this.state.texts,""]});
        }
    }

    renderTextArea=(i:number)=>{
        return (
        <Grid item key={`${i}`} xs={12} sm={6}>
            <Paper elevation={3}>
                <Box padding={2}>
                    <TextField color='secondary' label={`発言 ${i+1}`} multiline fullWidth value={this.state.texts[i]} onChange={(e) => this.handleChange(i,e.target.value)}/>
                </Box>
            </Paper>
        </Grid>);
        //return (<p key={i}><label>{`発言${i+1} : `}<textarea value={this.state.texts[i]} onChange={(e) => this.handleChange(i,e.target.value)} /></label></p>);
    }

    render=()=>{
        const textAreas=[];
        for(let i:number=0;i<this.state.texts.length;i++)textAreas.push(this.renderTextArea(i));

        return (
                <form onSubmit={this.handleSubmit}>
                    <Grid container spacing={2} alignItems="center" justify="flex-start">
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
    }//<Container><input type="button" value="+" onClick={this.addTextArea}/></Container>

}

export default InputForm;