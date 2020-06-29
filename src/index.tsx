import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/fonts.css';
import InputForm from './InputForm';
import Renderer from './renderer';
import { Typography, Container, Grid, Paper, Box, Divider, MuiThemeProvider, createMuiTheme, Link } from '@material-ui/core';  
import TitleImage from './title.jpg';

const howTo="下の空欄に発言を入力してください。もっと入力したいときは「＋」を押してください。入力が終わったら「作成」をタップ。"
const hints="できるだけたくさんの発言を入力しましょう！改行を多くすると文字の密度が上がって良い感じになります。画像はシード値をもとにランダム生成され、「更新」を押すと別のパターンに変化します。"
const license="発言まとめメーカーで生成された画像は、商用・非商用問わず無料でご利用いただけます。自由に編集・加工していただいて構いませんし、報告等も特に必要ありません。ご利用の際のクレジット表記について、商用の場合は「発言まとめメーカー」の名前とリンクを入れてください。生成された画像、およびその内容によって生じる損害については一切の責任を負いかねますのでご了承ください。";

const theme=createMuiTheme({

  palette:{
    primary:{main:'#ffd900'},
    secondary:{main:'#65318e'},
  },

  typography: {
    fontFamily: [
      'M PLUS Rounded 1c',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

interface AppProps{
}

interface AppState{
  seed:number,
  statements:string[],
}

class App extends React.Component<AppProps,AppState>{

  constructor(props:AppProps){
    super(props);
    
    this.state={statements:[],seed:1234567};

  }

  submitProperties=(seed:number, statements:string[])=>{
    const sum = statements.reduce((acc,cur)=>acc+cur.length,0);
    if(sum===0)statements=new Array(100).fill("発言を入力してください");
    this.setState({seed:seed ,statements:statements});
    //console.log(statements)
    //this.setState({statements:s});
  }

  render(){
    return (
      <div className="app" >
      <MuiThemeProvider theme={theme}>
      <Container style={{background:'white'}}>
        <Box paddingBottom={2}>
          <img src={TitleImage} style={{ pointerEvents:'none'}}/>
        </Box>
      </Container>

      <Container style={{background:'linear-gradient(#ffffff, #ede7f6)'}}>
        <Grid container spacing={2} alignItems="center" justify="center">
          <Grid item xs={12}>
          <Typography gutterBottom align='right'>
          <Link href="https://yukihirok.github.io/hatsugen-matome-maker/legacy/" color='secondary' target="_blank" rel="noopener">旧版はこちら</Link>
          </Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box padding={2}>
                <Typography variant='h6' gutterBottom align='center'>使い方</Typography>
                <Typography variant='body1' gutterBottom>{howTo}</Typography>
                <Typography variant='body1' gutterBottom>{hints}</Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box padding={2}>
                <Typography variant='h6' gutterBottom align='center'>画像の利用について</Typography>
                <Typography variant='body1' gutterBottom>{license}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        <Box paddingY={2}>
          <Divider variant='middle'/>
        </Box>
      </Container>

      <Container style={{background:'#ede7f6'}}>
        <InputForm onSubmit={this.submitProperties}/>
        {(this.state.statements.length===0)
          ?null
          :<Box paddingBottom={4}><Paper elevation={3}><Box padding={2}>
            <Renderer statements={this.state.statements} seed={this.state.seed} width={1500} height={1000}/>
          </Box></Paper></Box>
        }
      </Container>

      <Box style={{background:'#302833', color:'white'}}>
        <Typography align='center'>発言まとめメーカー</Typography>
        <Typography align='center'>Copyright © 2019-2020 <Link color='inherit' href="https://twitter.com/2000ymon" target="_blank" rel="noopener">@2000ymon</Link> All Rights Reserved.</Typography>
      </Box>

      </MuiThemeProvider>
    </div>
);
  }
}




ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

