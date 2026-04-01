

import * as crypto from 'crypto';
require('dotenv').config();

const key = process.env.chu_nk + process.env.part_5k + '56';
const iv = process.env.snap_part + process.env.w_free + 'op' ;



export function encrypt(text: string): string {
  var datset = createDat()
  const cipher = crypto.createCipheriv(datset, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}


export function decrypt(encrypted: any): string {
  var datset = createDat()
  const decipher = crypto.createDecipheriv(datset, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted
}

export function createDat() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alpha2 = alpha.map((x) => String.fromCharCode(x).toLowerCase());
  var gema = []
  for (let i = 1; i <= 100; i++) {
    gema.push(i)
  }
  const these = (alpha2[0]) + (alpha2[4]) + (alpha2[18]);
  const get = (alpha2[2]) + (alpha2[1]) + (alpha2[2]);
  const those = (gema[1]).toString() + (gema[4]).toString() + (gema[5]).toString();
  const theseGetThose = these + "-" + those + "-" + get
  return theseGetThose
}


 