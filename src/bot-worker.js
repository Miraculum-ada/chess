import {Chess} from 'chess.js';
import {chooseBotMove} from './bot.js';
self.onmessage=({data})=>{const game=new Chess();if(data.pgn)game.loadPgn(data.pgn);self.postMessage(chooseBotMove(game,2));};
