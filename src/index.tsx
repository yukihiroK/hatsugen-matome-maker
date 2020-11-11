import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import './css/fonts.css';
import InputForm from './InputForm';
import Renderer from './renderer';
import { Typography, Container, Grid, Paper, Box, Divider, MuiThemeProvider, createMuiTheme, Link } from '@material-ui/core';  
import TitleImage from './title.jpg';
import TextProps from './util/text_props';

const howTo="下の空欄に発言を入力してください。もっと入力したいときは「＋」を押してください。入力が終わったら「作成」をタップ。"
const hints="できるだけたくさんの発言を入力しましょう！画像はシード値をもとにランダム生成され、「更新」を押すと別のパターンに変化します。できた画像は長押しタップ等で保存できます。"
const letstweet="「#発言まとめメーカー」をつけてツイートしよう！";
const license="発言まとめメーカーで生成された画像は、商用・非商用問わず無料でご利用いただけます。自由に編集・加工していただいて構いません。使用報告等も不要です。ご利用の際のクレジット表記については、商用の場合のみ「発言まとめメーカー」の名称と当サイトのリンクを利用者が確認できる箇所にご記入ください。生成された画像、およびその内容によって生じる損害については一切の責任を負いかねますのでご了承ください。";

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
  //statements:string[],
  texts:TextProps[],
  backgroundColor:string,
  color:string,
}

class App extends React.Component<AppProps,AppState>{

  constructor(props:AppProps){
    super(props);
    
    this.state={texts:[],seed:1234567,backgroundColor:'white',color:'black'};

  }

  submitProperties=(seed:number,texts:TextProps[],backgroundColor:string,color:string)=>{
    //const sum = statements.reduce((acc,cur)=>acc+cur.length,0);
    //if(sum===0)statements=new Array(100).fill("発言を入力してください");
    this.setState({seed:seed ,texts:texts,backgroundColor:backgroundColor,color:color});
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
          {/* <Grid item xs={12}>
          <Typography gutterBottom align='right'>
          <Link href="https://yukihirok.github.io/hatsugen-matome-maker/legacy/" color='secondary' target="_blank" rel="noopener">旧版はこちら</Link>
          </Typography>
          </Grid> */}
          <Grid item xs={12}>
            <Paper elevation={3}>
              <Box padding={2}>
                <Typography variant='h6' gutterBottom align='center'>使い方</Typography>
                <Typography variant='body1' gutterBottom>{howTo}</Typography>
                <Typography variant='body1' gutterBottom>{hints}</Typography>
                <Typography variant='body1' gutterBottom>{letstweet}</Typography>
              </Box>
            </Paper>
          </Grid>
          {/* <Grid item xs={12}>
            <Paper elevation={3}>
              <Box padding={2}>
                <Typography variant='h6' gutterBottom align='center'>画像の利用について</Typography>
                <Typography variant='body1' gutterBottom>{license}</Typography>
              </Box>
            </Paper>
          </Grid> */}
        </Grid>
        <Box paddingY={2}>
          <Divider variant='middle'/>
        </Box>
      </Container>

      <Container style={{background:'#ede7f6'}}>
        <InputForm onSubmit={this.submitProperties}/>
        {(this.state.texts.length===0)
          ?null
          :<Box paddingBottom={4}><Paper elevation={3}><Box padding={2}>
            <Renderer texts={this.state.texts} seed={this.state.seed} width={1500} height={1000} backgroundColor={this.state.backgroundColor} color={this.state.color}/>
          </Box></Paper></Box>
        }
        <Box paddingTop={2} paddingBottom={4}>
          <Divider variant='middle'/>
        </Box>
      </Container>
      
      <Container style={{background:'linear-gradient(#ede7f6, #e597b2)'}}>
        <Box paddingBottom={4}>
          <Paper elevation={3}>
            <Box padding={2}>
              <Typography variant='h6' gutterBottom align='center'>画像の利用について</Typography>
              <Typography variant='body1' gutterBottom>{license}</Typography>
            </Box>
          </Paper>
        </Box>
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

