import { action, computed, observable } from 'mobx';
import { autobind } from 'core-decorators';
import moment from 'moment';
import i18n from 'i18n';
import 'moment/locale/is';

export default class UI {

  /**
   * @var List of available languages
   */
  languages = {
    en: 'English',
    is: 'Icelandic',
  };

  /**
   * @var List of theaters
   */
  theaters = [
    'Bíó Paradís',
    'Háskólabíó',
    'Smárabíó',
    'Laugarásbíó',
    'Borgarbíó Akureyri',
    'Sambíóin Egilshöll',
    'Sambíóin Kringlunni',
    'Sambíóin Álfabakka',
    'Sambíóin Akureyri',
    'Sambíóin Keflavík',
  ];

  /**
   * @var List of available order by types
   */
  orderBy = {
    popular: 'ORDER_BY_POPULAR',
    title: 'ORDER_BY_TITLE',
    rating: 'ORDER_BY_RATING',
  };

  constructor() {
    // Update internal clock on every 60 sec
    this.dateTimer = setInterval(() => (this.date = moment()), 60000);
  }

  /**
   * @var Flag if sidebar drawer is open
   */
  @observable
  isDrawerOpen = false;

  /**
   * @var Filter sheet flag
   */
  @observable
  isInTheatersFilterSheetOpen = false;

  /**
   * @var Details about current route
   */
  @observable
  route = {};

  /**
   * @var Current date as moment object
   */
  @observable
  date = moment();

  /**
   * @var Filters
   */
  @observable
  filter = {
    orderBy: 'popular',
    theaters: [],
    rating: 0,
  };

  /**
   * @var Selected language
   */
  @observable
  language = 'en';

  /**
   * @var Show synopsis
   */
  @observable
  showSynopsis = true;

  /**
   * Date in YYYY-mm-dd format
   * @uses UI.date
   */
  @computed
  get dateYmd() {
    return this.date.toISOString().substr(0, 10);
  }

  /**
   * i18n object
   * @uses UI.language
   */
  @computed
  get i18n() {
    moment.locale(this.language);
    return i18n[this.language] || i18n.en || {};
  }

  /**
   * Label of selected language
   * @uses UI.language
   */
  @computed
  get labelLanguage() {
    return this.languages[this.language] || 'Unkown language';
  }

  /**
   * Label for theaters selection
   * @uses UI.filter
   * @uses UI.i18n
   */
  @computed
  get labelTheaters() {
    const { theaters } = this.filter;
    if (theaters.length === 0) {
      return this.i18n.ALL_THEATERS;
    } else if (theaters.length > 1) {
      return this.i18n.LABEL_THEATERS(theaters);
    }
    return theaters.join(', ');
  }

  /**
   * Label for selected order by
   * @uses UI.filter
   * @uses UI.i18n
   */
  @computed
  get labelOrderBy() {
    return this.i18n[this.orderBy[this.filter.orderBy]] || this.i18n.UNKNOWN;
  }

  @autobind
  @action
  toggleInTheatersFilterSheetOpen() {
    this.isInTheatersFilterSheetOpen = !this.isInTheatersFilterSheetOpen;
  }

  /**
   * Keeps UI.route up to date on navigation.
   */
  @autobind
  @action
  dispatch(dispatchAction) {
    this.isDrawerOpen = false;
    const { scene, type } = dispatchAction;
    if (type === 'REACT_NATIVE_ROUTER_FLUX_FOCUS') {
      const props = {};
      const { storeProps = [] } = scene.component;
      storeProps.forEach((propName) => {
        if (scene[propName]) {
          props[propName] = scene[propName];
        }
      });
      this.route = { scene, props };
    }
    return dispatchAction;
  }

}
