const crypto=require('crypto');const jwt=require('jsonwebtoken');const config=require('./config');const {db}=require('./db');
function hashPassword(p){const salt=crypto.randomBytes(16).toString('hex');const hash=crypto.scryptSync(String(p),salt,64).toString('hex');return `${salt}:${hash}`}
function verifyPassword(p,stored){const [salt,hash]=String(stored).split(':');if(!salt||!hash)return false;const got=crypto.scryptSync(String(p),salt,64);return crypto.timingSafeEqual(got,Buffer.from(hash,'hex'))}
function accessToken(user){return jwt.sign({sub:user.id,role:user.role},config.jwt.secret,{expiresIn:'15m'})}
function refreshToken(){return crypto.randomBytes(48).toString('base64url')}
function hashToken(t){return crypto.createHash('sha256').update(t).digest('hex')}
function issueRefresh(userId){const raw=refreshToken();db.prepare(`INSERT INTO refresh_tokens(user_id,token_hash,expires_at) VALUES(?,?,datetime('now','+30 day'))`).run(userId,hashToken(raw));return raw}
function rotateRefresh(raw){const row=db.prepare(`SELECT * FROM refresh_tokens WHERE token_hash=? AND revoked_at IS NULL AND expires_at>datetime('now')`).get(hashToken(raw));if(!row) return null;db.prepare(`UPDATE refresh_tokens SET revoked_at=datetime('now') WHERE id=?`).run(row.id);return {userId:row.user_id,raw:issueRefresh(row.user_id)}}
function requireAuth(req,res,next){const h=req.get('authorization')||'';const token=h.startsWith('Bearer ')?h.slice(7):'';try{req.user=jwt.verify(token,config.jwt.secret);next()}catch{res.status(401).json({error:{code:'AUTH_REQUIRED',message:'Authentication required'}})}}
module.exports={hashPassword,verifyPassword,accessToken,issueRefresh,rotateRefresh,requireAuth};
