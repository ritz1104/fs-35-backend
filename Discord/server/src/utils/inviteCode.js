import crypto from 'crypto'


export const generateInviteCode = ()=>{
return crypto.randomBytes(16).toString('hex')
}

