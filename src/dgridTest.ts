import WidgetBase from '@dojo/widget-core/WidgetBase';
import { v, w } from '@dojo/widget-core/d';
import DgridWrapper, { GridType } from './dgrid/DGridWrapper';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
const data = [
	{ id: 0, name: 'Nick Nisi' },
	{ id: 1, name: 'Bradley Maier' }
];

const columns = {
	id: 'ID',
	name: 'NAME'
};

class Main extends WidgetBase {
	protected render() {
		return v('div', {
			classes: [ 'main' ]
		}, [
			w(DgridWrapper, {
				type: GridType.Grid,
				data,
				columns
			})
		]);
	}
}

const Projector = ProjectorMixin(Main);
const projector = new Projector();
const root = document.querySelector('#root')!;

projector.append(root);
