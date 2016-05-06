import React, {
  Component,
  View,
  StyleSheet,
  PropTypes,
} from 'react-native';
import { GiftedForm } from 'react-native-gifted-form';

/**
 * Movie Detail Scene
 */
export default class SceneFilters extends Component {

  /**
   * PropTypes
   * @return {object}
   */
  static propTypes = {
    navigator: PropTypes.object,
    data: PropTypes.object,
    onSave: PropTypes.func,
  };

  /**
   * Constructor proxy, default state, superbinds.
   * @return {void}
   */
  constructor(...args) {
    super(...args);

    // Set initial state
    this.state = {
      data: {
        cinema: ['Öll kvikmyndahús'],
        orderBy: ['Fjölda sýninga'],
        showtime: ['Allir sýningatímar'],
      },
    };

    // Superbind methods
    this.onFormChanged = this.onFormChanged.bind(this);
  }

  /**
   * Fired when gifted form changes
   * @param {object} Object with values
   * @return {void}
   */
  onFormChanged(data) {
    if (this.props.onSave) {
      this.props.onSave(data);
    }

    // Bump data to state
    this.setState({
      data,
    });
  }

  /**
   * Render method
   * @return {Component}
   */
  render() {

    // Deconstruct for better clarity
    const { SelectWidget, ModalWidget, OptionWidget } = GiftedForm;
    const { navigator } = this.props;

    // List cinemas available
    const cinemas = [
      'Smárabíó', 'Háskólabíó', 'Borgarbíó', 'Laugarásbíó', 'Bíó Paradís',
      ...['Álfabakka', 'Kringlunni', 'Egilshöll', 'Akureyri', 'Keflavík']
      .map(location => `Sambíóin ${location}`),
    ];

    // OrderBy options
    const orderList = [
      'Fjölda sýninga', 'Nafni kvikmyndar',
      'IMDb einkunn', 'Lengd sýningar',
    ];

    // Showtime options
    const showtimes = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    .map(n => `${n}:00`);
    showtimes.splice(0, 1, 'Allir sýningatímar');

    // Deconstruct properties from data
    const { cinema, orderBy, showtime } = this.state.data;

    // Set defaults for form
    const defaults = {
      [`cinema{${[].concat(cinema).pop()}}`]: true,
      [`orderBy{${[].concat(orderBy).pop()}}`]: true,
    };
    [].concat(showtime).forEach(s => {
      defaults[`showtime{${s}}`] = true;
    });

    return (
      <View style={s.host}>
        <GiftedForm
          openModal={route => navigator.push(route)}
          onValueChange={this.onFormChanged}
          defaults={defaults}
        >
          <ModalWidget title="Kvikmyndahús" displayValue="cinema">
            <SelectWidget name="cinema" title="Kvikmyndahús" multiple={false}>
              <OptionWidget title="Öll kvikmyndahús" />
              {cinemas.map((name, i) => (
                <OptionWidget key={i} title={name} />
              ))}
            </SelectWidget>
          </ModalWidget>

          <ModalWidget title="Raða eftir" displayValue="orderBy">
            <SelectWidget name="orderBy" title="Raða eftir" multiple={false}>
              {orderList.map((name, i) => (
                <OptionWidget key={i} title={name} />
              ))}
            </SelectWidget>
          </ModalWidget>

          <ModalWidget title="Sýningatímar" displayValue="showtime">
            <SelectWidget name="showtime" title="Sýningatímar" multiple>
              {showtimes.map((name, i) => (
                <OptionWidget key={i} title={name} />
              ))}
            </SelectWidget>
          </ModalWidget>
        </GiftedForm>
      </View>
    );
  }
}

/**
 * @const {StyleSheet} Component styles
 */
const s = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
