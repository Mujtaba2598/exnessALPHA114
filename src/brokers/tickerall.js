const config=require('../config');const {enc,dec}=require('../crypto');const crypto=require('crypto');
async function call(path,opts={}){if(!config.tickerall.apiKey)throw new Error('TICKERALL_API_KEY is not configured');const r=await fetch(config.tickerall.baseUrl+path,{...opts,headers:{Authorization:`Bearer ${config.tickerall.apiKey}`,'Content-Type':'application/json',...(opts.headers||{})}});const text=await r.text();let d={};try{d=text?JSON.parse(text):{}}catch{d={raw:text}}if(!r.ok){const e=new Error(d?.error?.message||d?.message||`TickerAll HTTP ${r.status}`);e.status=r.status;throw e}return d}
async function connect({broker='mt5',server,account,password,terminalType='MOBILE'}){return call('/v1/sessions',{method:'POST',body:JSON.stringify({broker,server,account,password,terminalType})})}
async function disconnect(accountId){return call(`/v1/sessions/${encodeURIComponent(accountId)}`,{method:'DELETE'})}
async function account(accountId){return call(`/v1/accounts/${encodeURIComponent(accountId)}`)}
async function candles(accountId,symbol,timeframe='H1',limit=500){const q=new URLSearchParams({symbol,timeframe:String(timeframe)});const d=await call(`/v1/accounts/${encodeURIComponent(accountId)}/candles?${q}`);return (d.candles||[]).map(c=>({t:c.timestamp*1000,o:Number(c.open),h:Number(c.high),l:Number(c.low),c:Number(c.close),bid:Number(c.bid??c.close)})).slice(-limit)}
async function positions(accountId){const d=await account(accountId);return d.positions||[]}
async function symbols(accountId){return (await call(`/v1/accounts/${encodeURIComponent(accountId)}/symbols`)).symbols||[]}
async function tradeHistory(accountId){const d=await call(`/v1/accounts/${encodeURIComponent(accountId)}/history`);return d||{}}
function packPassword(p){return enc(p)}
function unpackPassword(p){return dec(p)}
function idempotency(){return crypto.randomUUID()}
module.exports={connect,disconnect,account,candles,positions,symbols,tradeHistory,packPassword,unpackPassword,idempotency};
