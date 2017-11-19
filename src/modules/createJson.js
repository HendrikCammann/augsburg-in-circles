import augsburg from '../data/augsburg.json';

import _lechhausen from '../data/districts/lechhausen.json';
import _hochzoll from '../data/districts/hochzoll.json';
import _hammerschmiede from '../data/districts/hammerschmiede.json';
import _firnhaberau from '../data/districts/firnhaberau.json';
import _textilviertel from '../data/districts/textilviertel.json';
import _spickel from '../data/districts/spickel.json';
import _herrenbach from '../data/districts/herrenbach.json';
import _goeggingen from '../data/districts/goeggingen.json';
import _haunstetten from '../data/districts/haunstetten.json';
import _inningen from '../data/districts/inningen.json';
import _bergheim from '../data/districts/bergheim.json';
import _univiertel from '../data/districts/univiertel.json';
import _hochfeld from '../data/districts/hochfeld.json';
import _antonsviertel from '../data/districts/antonsviertel.json';
import _oberhausen from '../data/districts/oberhausen.json';
import _baerenkeller from '../data/districts/baerenkeller.json';
import _kriegshaber from '../data/districts/kriegshaber.json';
import _pfersee from '../data/districts/pfersee.json';
import _innenstadt from '../data/districts/innenstadt.json';
import _jakobervorstadt from '../data/districts/jakobervorstadt.json';

let _districts = [_lechhausen, _hochzoll, _hammerschmiede, _firnhaberau, _textilviertel, _spickel, _herrenbach, _goeggingen, _haunstetten, _inningen, _bergheim, _univiertel, _hochfeld, _antonsviertel, _oberhausen, _baerenkeller, _kriegshaber, _pfersee, _innenstadt, _jakobervorstadt];

export default function createJson() {
	for (let i = 0; i < augsburg.data.length; i++) {
		for (let j = 0; j < _districts.length; j++) {
			augsburg.data[i].districts.push(_districts[j].data[i]);
			if(_districts[j].data[i].data.residents > augsburg.maxVal.residents) {
				augsburg.maxVal.residents = _districts[j].data[i].data.residents;
			}
			if(_districts[j].data[i].data.students > augsburg.maxVal.students) {
				augsburg.maxVal.students = _districts[j].data[i].data.students;
			}
		}
	}
	return augsburg;
}
