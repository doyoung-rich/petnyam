import assert from 'node:assert/strict';
import {normalizeServiceKey,providerResult,checkOperation,animalOperations} from './check-animal-api.mjs';
const operations=animalOperations({ANIMAL_GO_KR_API_KEY:'rescue-test',ANIMAL_REGISTER_API_KEY:'register-test',ANIMAL_LOST_API_KEY:'obsolete-test'});
assert.equal(operations.length,2);assert.ok(operations.every(operation=>!operation.path.includes('lossInfoService')));
assert.deepEqual(operations.map(operation=>operation.key),['register-test','rescue-test']);
assert.equal(normalizeServiceKey('abc%2Bdef%2Fghi%3D'),'abc+def/ghi=');
assert.equal(normalizeServiceKey(' abc+def/ghi= '),'abc+def/ghi=');
assert.equal(normalizeServiceKey(''),null);
assert.throws(()=>normalizeServiceKey('https://apis.data.go.kr/example'));
assert.throws(()=>normalizeServiceKey('serviceKey=not-a-key'));
const secret='synthetic+key/only=';
const response=body=>({ok:true,status:200,text:async()=>body});
let urlSeen;
const success=await checkOperation({label:'test',path:'lossInfoService/lossInfoSido',key:secret},async url=>{urlSeen=url;return response(JSON.stringify({response:{header:{resultCode:'00'},body:{items:{item:[{orgCd:'123'}]}}}}));});
assert.equal(urlSeen.protocol,'https:');assert.equal(urlSeen.searchParams.get('serviceKey'),secret);assert.equal(success.status,'success');assert.equal(success.itemCount,1);
// An Encoding key copied from the portal must arrive as the same credential,
// rather than being encoded twice in the outgoing request.
await checkOperation({label:'encoded-key-test',path:'abandonmentPublicService_v2/sido_v2',key:encodeURIComponent(secret)},async url=>{
 assert.equal(url.searchParams.get('serviceKey'),secret);
 assert.ok(!url.search.includes('%252B')&&!url.search.includes('%252F'));
 return response('{"response":{"header":{"resultCode":"00"},"body":{"items":{}}}}');
});
const xml=providerResult('<OpenAPI_ServiceResponse><returnReasonCode>30</returnReasonCode><returnAuthMsg>SERVICE_KEY_IS_NOT_REGISTERED_ERROR</returnAuthMsg></OpenAPI_ServiceResponse>');
assert.equal(xml.code,'30');assert.equal(xml.denied,true);
const forbidden=await checkOperation({label:'test',path:'lossInfoService/lossInfo',key:secret},async()=>({ok:false,status:403,text:async()=>'<returnReasonCode>20</returnReasonCode><returnAuthMsg>SERVICE_ACCESS_DENIED_ERROR</returnAuthMsg>'}));
assert.equal(forbidden.reason,'SERVICE_ACCESS_DENIED_ERROR');assert.equal(forbidden.http,403);
const privateBody=JSON.stringify({response:{header:{resultCode:'00'},body:{items:{item:[{callName:'PRIVATE_OWNER',callTel:'PRIVATE_PHONE',rfidCd:'PRIVATE_RFID'}]}}}});
const privateResult=await checkOperation({label:'test',path:'lossInfoService/lossInfo',key:secret},async()=>response(privateBody));
assert.ok(!JSON.stringify(privateResult).includes('PRIVATE_'));assert.ok(!JSON.stringify(privateResult).includes(secret));
const failed=await checkOperation({label:'test',path:'lossInfoService/lossInfo',key:secret},async()=>{throw new Error('URL contained '+secret);});assert.deepEqual(failed,{label:'test',status:'connection-failed',reason:'Error'});
const required=await checkOperation({label:'test',path:'animalInfoSrvc_v3/animalInfo_v3',key:secret,requiresIdentity:true},async()=>response('{"response":{"header":{"resultCode":"10","resultMsg":"필수 입력 오류"}}}'));
assert.equal(required.status,'identity-required');assert.ok(required.scope.includes('not verified'));
assert.equal((await checkOperation({label:'test',path:'lossInfoService/lossInfo',key:''})).status,'missing-secret');
console.log('Animal API checker verified: HTTPS, encoded keys, XML/JSON, missing keys, errors and exclusion of private records.');
