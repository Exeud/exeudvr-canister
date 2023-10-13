import { Principal } from "@dfinity/principal";
import { HttpAgent, Actor } from '@dfinity/agent';
import  idlFactory  from './ext.did';

const tokenCanisterId = "cps3y-fiaaa-aaaak-qav4a-cai";

export const createTokenActor = (agent: HttpAgent) => {
  return Actor.createActor (idlFactory, {
    agent, canisterId: Principal.fromText(tokenCanisterId),
  });
}
 
export default { createTokenActor };