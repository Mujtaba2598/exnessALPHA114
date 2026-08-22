const path=require('path');
const dotenv=require('dotenv');
dotenv.config();
const env=process.env;
const asNum=(k,d)=>Number.isFinite(Number(env[k]))?Number(env[k]):d;
const asBool=(k,d=false)=>env[k]==null?d:String(env[k]).toLowerCase()==='true';
const key=env.ENCRYPTION_KEY||'';
if(key && !/^[0-9a-fA-F]{64}$/.test(key)) throw new Error('ENCRYPTION_KEY must be exactly 64 hex characters (32 bytes).');
module.exports={
 env:env.NODE_ENV||'development', isProd:(env.NODE_ENV||'development')==='production',
 port:asNum('PORT',3000), appUrl:env.APP_URL||'http://localhost:3000',
 dbFile:path.resolve(process.cwd(),env.DATABASE_FILE||'./data/alpha.sqlite'),
 owner:{email:(env.OWNER_EMAIL||'').toLowerCase(),password:env.OWNER_PASSWORD||''},
 jwt:{secret:env.JWT_SECRET||'dev-only-change-me'}, encryptionKey:key,
 tickerall:{apiKey:env.TICKERALL_API_KEY||'',baseUrl:env.TICKERALL_BASE_URL||'https://api.tickerall.com'},
 trading:{liveOrderExecution:asBool('LIVE_ORDER_EXECUTION',false),maxConcurrentPositions:asNum('MAX_CONCURRENT_POSITIONS',10),tickMs:asNum('BOT_TICK_MS',15000),watchlist:['AAPL','MSFT','NVDA']},
 risk:{riskPercent:asNum('RISK_PERCENT',0.5),dailyLossCap:asNum('DAILY_LOSS_CAP',2),maxPositionPercent:asNum('MAX_POSITION_PERCENT',10),cashReservePercent:asNum('CASH_RESERVE_PERCENT',20),minRewardRisk:asNum('MIN_REWARD_RISK',1.5),minConfidence:asNum('MIN_CONFIDENCE',0.68)},
 shariah:{profile:'screened_equity',maxDebtRatio:0.33,maxInterestAssetsRatio:0.33,maxImpureIncomeRatio:0.05,screeningMaxAgeDays:30}
};
