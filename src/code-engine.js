// A deliberately small interpreted language. User text is never passed to eval/Function.
function tokenize(source) {
 if (source.length > 6000) throw new Error('Код слишком длинный. Максимум — 6000 символов.');
 const tokens=[]; const re=/\s+|\/\/[^\n]*|"[^"\n]*"|'[^'\n]*'|[A-Za-z_][A-Za-z_0-9]*|[.(){},;=]/gy;
 let pos=0;
 while(pos<source.length) { re.lastIndex=pos; const m=re.exec(source); if(!m) throw new Error(`Неизвестный символ в позиции ${pos+1}. Используйте команды из справки.`); pos=re.lastIndex; if(!/^\s|^\/\//.test(m[0])) tokens.push(m[0]); }
 return tokens;
}
export function parseCode(source) {
 const tokens=tokenize(source); let i=0; let depth=0;
 const take=(expected)=>{const t=tokens[i++]; if(expected && t!==expected) throw new Error(`Ожидается «${expected}», получено «${t??'конец кода'}».`); return t;};
 const value=()=> { const t=take(); if(!t) throw new Error('Укажите клетку, например "e4".'); if(/^['"]/.test(t))return {literal:t.slice(1,-1)}; if(/^[a-zA-Z_]\w*$/.test(t))return {variable:t}; throw new Error('Ожидается строка или имя переменной.'); };
 const call=(method)=>{take('piece');take('.'); const fn=take();if(method&&fn!==method)throw new Error(`В условии используйте piece.${method}().`);if(!['move','canMove'].includes(fn))throw new Error(`Команда «${fn}» не поддерживается.`);take('(');const args=[value()];if(tokens[i]===','){take(',');args.push(value());}take(')');return {type:fn,args};};
 const block=()=>{if(++depth>12)throw new Error('Слишком много вложенных условий.');take('{');const statements=[];while(tokens[i]!=='}'){if(i>=tokens.length)throw new Error('Закройте блок символом }.');statements.push(statement());}take('}');depth--;return statements;};
 const statement=()=>{let result;if(tokens[i]==='const'){take();const name=take();if(!/^[a-zA-Z_]\w*$/.test(name)||['piece','const','if','else'].includes(name))throw new Error('Некорректное имя переменной.');take('=');result={type:'const',name,value:value()};}
 else if(tokens[i]==='if'){take();take('(');const condition=call('canMove');take(')');const yes=block();let no=[];if(tokens[i]==='else'){take();no=block();}return {type:'if',condition,yes,no};}
 else {result=call();if(result.type!=='move')throw new Error('piece.canMove() используется внутри if.');}if(tokens[i]===';')take();return result;};
 const program=[];while(i<tokens.length)program.push(statement());if(!program.length)throw new Error('Напишите ход: piece.move("e4");');return program;
}
export function runCode(source,game,from) {
 const program=parseCode(source);
 if(game.isGameOver())throw new Error('Партия завершена. Начните новую игру.');
 const piece=game.get(from); if(!piece || piece.color!==game.turn())throw new Error('Сначала выберите на доске фигуру той стороны, чей сейчас ход.');
 const variables=new Map();let proposal=null;
 const resolve=(v)=> {if('literal'in v)return v.literal;if(!variables.has(v.variable))throw new Error(`Переменная «${v.variable}» не объявлена.`);return variables.get(v.variable);};
 const candidate=(args)=>{const to=resolve(args[0]);const promotion=args[1]?resolve(args[1]):undefined;if(!/^[a-h][1-8]$/.test(to))throw new Error(`«${to}» — не клетка доски. Используйте a1–h8.`);if(promotion&&!['q','r','b','n'].includes(promotion))throw new Error('Для превращения: q — ферзь, r — ладья, b — слон, n — конь.');return {from,to,...(promotion?{promotion}:{})};};
 const legal=(m)=>game.moves({square:from,verbose:true}).some(x=>x.to===m.to&&(!m.promotion||x.promotion===m.promotion));
 const execute=(statements)=>{for(const s of statements){if(s.type==='const'){if(variables.has(s.name))throw new Error(`Переменная «${s.name}» уже объявлена.`);variables.set(s.name,resolve(s.value));}else if(s.type==='if'){execute(legal(candidate(s.condition.args))?s.yes:s.no);}else{if(proposal)throw new Error('Один запуск — один ход. Оставьте одну выполняемую команду piece.move().');const m=candidate(s.args);if(!legal(m))throw new Error(`Ход ${from} → ${m.to} невозможен: проверьте правило фигуры, препятствия и безопасность короля.`);proposal=m;}}};
 execute(program);return proposal;
}
