import { Actor, HttpAgent, Identity } from "@dfinity/agent";
import { _SERVICE } from "../declarations/backend/backend.did";
import { idlFactory } from  '../declarations/backend';

const isLocalEnv = process.env.NODE_ENV !== "production";
const canisterId = process.env.CANISTER_ID_BACKEND;
const noBackend = !canisterId || canisterId === "aaaaa-aa";

function createNoopActor(): _SERVICE {
  return new Proxy({} as _SERVICE, {
    get: (_target, prop) => {
      if (typeof prop === "string") {
        return (..._args: unknown[]) =>
          Promise.reject(new Error(`[no-backend] canister call '${prop}' skipped`));
      }
    },
  });
}

function createActor(identity?: Identity) {
  const agent = new HttpAgent({
	     identity,
	     host: window.location.href.includes('localhost') ? 'http://127.0.0.1:4943' : undefined,
       });
  const actor = Actor.createActor<_SERVICE>(idlFactory, {
    agent,
	canisterId
  });
  return { actor, agent };
}

/*
 * Responsible for keeping track of the actor, whether the user has logged
 * in again or not. A logged in user uses a different actor with their
 * Identity, to ensure their Principal is passed to the backend.
 */
class ActorController {
  _actor: Promise<_SERVICE>;
  _isAuthenticated: boolean = false;

  constructor() {
    this._actor = this.initBaseActor();
  }

  async initBaseActor(identity?: Identity) {
    if (noBackend) return createNoopActor();
    const { agent, actor } = createActor(identity);
    // The root key only has to be fetched for local development environments
    if (isLocalEnv) {
      await agent.fetchRootKey();
    }
    return actor;
  }

  /*
   * Get the actor instance to run commands on the canister.
   */
  get actor() {
    return this._actor;
  }

  /*
   * Once a user has authenticated and has an identity pass this identity
   * to create a new actor with it, so they pass their Principal to the backend.
   */
  async authenticateActor(identity: Identity) {
    this._actor = this.initBaseActor(identity);
    this._isAuthenticated = true;
  }

  /*
   * If a user unauthenticates, recreate the actor without an identity.
   */
  unauthenticateActor() {
    this._actor = this.initBaseActor();
    this._isAuthenticated = false;
  }
}

export const actorController = new ActorController();
