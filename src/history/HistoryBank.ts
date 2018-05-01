import { BaseEvent, BaseListener, BaseObject } from "../models/BaseObject";
import * as _ from "lodash";

export interface HistoryBankListener extends BaseListener<HistoryBank> {
	forward?(event: BaseEvent<HistoryBank> & { state: any });

	backward?(event: BaseEvent<HistoryBank> & { state: any });
}

export class HistoryBank extends BaseObject<HistoryBankListener> {
	history: any[];
	pointer: number;

	constructor() {
		super();
		this.history = [];
		this.pointer = 0;
	}

	pushState(state: any) {
		// state is equal, ignore pushing it
		if (_.isEqual(this.history[this.pointer], state)) {
			return;
		}

		this.pointer++;
		this.history.splice(this.pointer);
		this.history.push(state);
	}

	goForward() {
		// cant go anymore forward
		if (this.pointer === this.history.length - 1) {
			return;
		}
		this.pointer++;
		this.iterateListeners("history moved forward", (listener, event) => {
			if (listener.forward) {
				listener.forward({ ...event, state: this.history[this.pointer] });
			}
		});
	}

	goBackward() {
		// cant go anymore backward
		if (this.pointer <= 0) {
			return;
		}
		this.pointer--;
		this.iterateListeners("history moved backward", (listener, event) => {
			if (listener.backward) {
				listener.backward({ ...event, state: this.history[this.pointer] });
			}
		});
	}
}
