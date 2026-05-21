import { Identity } from "@dfinity/agent";
import { useAuth } from "../auth/auth";

interface loginResponse {
    cbindex: number,
    result: boolean,
    principal: string,
    accountId: string,
    error?: string
}

// Extend this file with new unity functions
export default function AddUnityFunctions(unityContext) {
	
    const auth = useAuth();
	
    unityContext.on("ICLogin", async function (cbIndex) {
		await IILogin(cbIndex, unityContext, auth);
	});

	unityContext.on("ICLogout", async function (cbIndex) {
		await IILogout(cbIndex, unityContext, auth);
	});
}
    
async function IILogin(cbIndex, ctx, auth) { 
    try {
		let data: loginResponse = {
            cbindex: cbIndex,
            result: false,
            principal: "",
            accountId: ""
        }

		data.cbindex = cbIndex;
		if (auth.isAuthReady && 
			auth.identity &&
			!auth.identity.getPrincipal().isAnonymous()){
			data.principal = auth.identity.getPrincipal().toString();
			data.result = true;
		}
		else{
			const identity: Identity = await auth?.logIn();
			const principal = identity.getPrincipal();
			data.principal = principal.toString();
			data.result = auth?.isAuthReady;
		}
		data.accountId = "";
		const sendStr = JSON.stringify(data);
        ctx.send("CanisterConnection", "HandleCallback", sendStr);

    } catch (e) {
        ctx.send("CanisterConnection", "HandleCallback", JSON.stringify(e.message));
    }
}

async function IILogout(cbIndex, unityContext, auth) { 
	await auth?.logOut();
	let data: loginResponse = {
		cbindex: cbIndex,
		result: true,
		principal: "",
		accountId: ""
	}
	const sendStr = JSON.stringify(data);
	unityContext.send("CanisterConnection", "HandleCallback", sendStr);
}
