import Principal "mo:base/Principal";

shared(creator) actor class ExeudVR_Actor() = this {
	public func idQuick() : async Principal {
      Principal.fromActor(this)
    };
}
