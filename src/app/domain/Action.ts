export interface Action {

}

export class SwitchCards implements Action {
    public ["@type"] = "SwitchCards";

	constructor(public card1Id: string,
	            public card2Id: string) {}
}

export class ViewCards implements Action {
    public ["@type"] = "ViewCards";
    
	constructor(public cardIds: string[]) {}
}

export class HideCards implements Action {
    public ["@type"] = "HideCards";
    
	constructor(public cardIds: string[]) {}
}