import { v } from '@dojo/widget-core/d';
import { VNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import afterRender from '@dojo/widget-core/decorators/afterRender';
import MetaBase from '@dojo/widget-core/meta/Base';

import declare = require('dojo/_base/declare');
import List = require('dgrid/List');
import OnDemandList = require('dgrid/OnDemandList');
import Grid = require('dgrid/Grid');
import OnDemandGrid = require('dgrid/OnDemandGrid');
import Pagination = require('dgrid/extensions/Pagination');
import MemoryStore = require('dojo-dstore/Memory');

/**
 * An internal meta provider that provides the rendered DOM node on _root_ Dijits
 */
class DomNode extends MetaBase {
	get(key: string | number) {
		return this.getNode(key);
	}
}

export enum GridType {
	List,
	Grid,
	PaginatedGrid
}

/**
 * Internal `key` constant
 */
const DEFAULT_KEY = 'root';

export interface DgridWrapperProperties<T> {
	type: GridType;
	data: T[];
	columns: { [columnName: string]: string };
}

function getGridBase(gridType: GridType) {
	switch (gridType) {
		case GridType.PaginatedGrid:
			return declare([Grid, Pagination]);
		case GridType.List:
			return OnDemandList;
		case GridType.Grid:
			return OnDemandGrid;
	}
}

/**
 * Wrap a Dojo 1 Dijit, so that it can exist inside of the Dojo 2 widgeting system.
 * @param Dijit The constructor function for the Dijit
 * @param tagName The tag name that should be used when creating the DOM for the dijit. Defaults to `div`.
 */
class DgridWrapper<T = {}> extends WidgetBase<DgridWrapperProperties<T>> {
	private _grid: Pagination<T> | undefined;
	private _node: HTMLElement | undefined;
	private _store: MemoryStore | undefined;

	private _updateGrid(data: T[]) {
		// not null assertion, because this can only be called when `_dijit` is assigned
		this._store!.setData(data);
	}

	protected render(): VNode {
		const { key = DEFAULT_KEY, data } = this.properties;
		if (this._grid) {
			this._updateGrid(data);
		}

		return v('div', { key });
	}

	protected onDetach(): void {
		this._grid && this._grid.destroy();
	}

	@afterRender()
	public initGrid(result: VNode) {
		const { key = DEFAULT_KEY, data, columns, type: gridType } = this.properties;
		const node = this._node = this.meta(DomNode).get(key) as HTMLElement;
		const collection = this._store = new MemoryStore({ data });
		const Grid = getGridBase(gridType);
		this._grid = new Grid(
			{ collection, columns },
			node
		);

		console.log('_grid', this._grid);

		return result;
	}
}

export default DgridWrapper;
