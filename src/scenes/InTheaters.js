import React, {
  Component,
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import MovieListItem from '../components/MovieListItem';
import MovieDetails from './MovieDetails';

export default class SceneInTheaters extends Component {

  constructor(...args) {
    super(...args);

    this.state = {
      items: [{
        id: 1,
        image: 'http://image.tmdb.org/t/p/w396/5N20rQURev5CNDcMjHVUZhpoCNC.jpg',
        backdrop: 'https://image.tmdb.org/t/p/w780/m5O3SZvQ6EgD5XXXLPIP1wLppeW.jpg',
        trailer: 'https://www.youtube.com/watch?v=e76nZeBRBYI',
        title: 'Captain America: Civil War',
        synoptis: `Vegna misheppnaðra aðgerða sem kostað hafa mannslíf hefur stjórnin ákveðið að hér eftir þurfi Avengers-hópurinn og aðrir með ofurkrafta að fylgja ströngum reglum. Við þetta vill Steve Rogers ekki sætta sig þvert á vilja Tonys Stark og smám saman magnast deilan uns á brestur bardagi sem á eftir að taka sinn toll.`,
        directors: ['Anthony Russo', 'Joe Russo'],
        actors: ['Chris Evans', 'Robert Downey Jr.'],
        genres: ['Spenna', 'Spennutryllir', 'Vísindaskáldskapur'],
        year: 2016,
        runtime: 146,
        rating: 8.7,
        metascore: 7.1,
        showtimes: [{
          cinema: 'Sambíóin Egilshöll',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210586/',
          hour: '16:00',
          flags: []
        },
        {
          cinema: 'Sambíóin Egilshöll',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210584/',
          hour: '19:00',
          flags: []
        }, {
          cinema: 'Sambíóin Egilshöll',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210585/',
          hour: '22:00',
          flags: []
        }, {
          cinema: 'Sambíóin Álfabakki',
          hall: 'VIP',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210303/',
          hour: '17:00',
          flags: []
        }, {
          cinema: 'Sambíóin Álfabakki',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210292/',
          hour: '17:00',
          flags: []
        }, {
          cinema: 'Sambíóin Álfabakki',
          hall: 'VIP',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210304/',
          hour: '20:00',
          flags: []
        }, {
          cinema: 'Sambíóin Álfabakki',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210293/',
          hour: '20:00',
          flags: []
        }, {
          cinema: 'Sambíóin Álfabakki',
          hall: 'VIP',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210305/',
          hour: '23:05',
          flags: [] },
          { cinema: 'Sambíóin Álfabakki',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210294/',
          hour: '23:05',
          flags: [] },
          { cinema: 'Sambíóin Kringlan',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210310/',
          hour: '17:00',
          flags: ['íslenska'] },
          { cinema: 'Sambíóin Kringlan',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210311/',
          hour: '20:00',
          flags: ['3D'] },
          { cinema: 'Sambíóin Kringlan',
          hall: 'Salur 2',
          ticketUrl: 'https://www.sambio.is/Websales/Show/210312/',
          hour: '23:00',
          flags: []
        }]
      }]
    };

    this.onPress = this.onPress.bind(this);
  }

  onPress(item) {
    return () => {
      this.props.navigator.push({
        title: item.title,
        component: MovieDetails,
        passProps: item,
      });
    }
  }

  /**
   * Render method
   * @return {Component}
   */
  render () {
    const { items } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          {items.map(item => (
            <TouchableHighlight key={item.id} underlayColor="#f8f8ee" onPress={this.onPress(item)}>
              <View>
                <MovieListItem {...item} />
              </View>
            </TouchableHighlight>
          ))}
        </ScrollView>
      </View>
    );
  }
}
