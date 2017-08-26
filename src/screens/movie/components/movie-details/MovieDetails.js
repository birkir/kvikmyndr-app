import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, ActivityIndicator, View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { inject } from 'mobx-react/native';
import get from 'lodash/get';
import format from 'date-fns/format';
import withMovieDetails from '../../../../store/queries/withMovieDetails';
import CollapsedText from '../../../../components/collapsed-text';
import PersonCard from '../../../../components/person-card';
import ShowtimesWeek from '../../../../components/showtimes-week';
import formatCurrency from '../../../../utils/formatCurrency';
import openUrl from '../../../../utils/openUrl';

@inject('ui')
@withMovieDetails
export default class MovieDetails extends Component {

  static propTypes = {
    data: PropTypes.object.isRequired,
  }

  filterCredit(credit) {
    if (!credit.cast || !credit.cast.name) return false;
    return true;
  }

  applyLocale(localeName, data) {
    const result = { ...data };
    const locale = data.locales.find(item => item.locale === localeName);
    if (locale) {
      Object.entries(locale).forEach(([key, value]) => {
        if (value) {
          result[key] = value;
        }
      });
    }
    return result;
  }

  renderSection(title, control) {
    if (!control) return null;
    return (
      <View style={styles.control}>
        <Text style={styles.heading}>{title}</Text>
        {typeof control === 'string'
          ? <Text style={styles.text}>{control}</Text>
          : control
        }
      </View>
    );
  }

  renderSummary(summary) {
    if (!summary) return null;
    return this.renderSection('Summary', (
      <CollapsedText numberOfLines={4} style={styles.text}>
        {summary.replace(/\n/g, ' ').replace(/([.?!])\s*(?=[A-Z])/g, '$1\n\n')}
      </CollapsedText>
    ));
  }

  renderLink(title, url) {
    if (!url) return null;
    return this.renderSection(title, (
      <TouchableOpacity onPress={() => openUrl(url)}>
        <Text style={styles.text}>{url}</Text>
      </TouchableOpacity>
    ));
  }

  renderCurrency(title, value) {
    if (!value || value === 0) return null;
    return this.renderSection(title, `$${formatCurrency(value)}`);
  }

  renderReleaseDate(releaseDate) {
    if (!releaseDate) return null;
    return this.renderSection('First released', format(releaseDate, 'MMMM Do, YYYY'));
  }

  renderCredits(credits = []) {
    const persons = credits.filter(this.filterCredit);
    if (persons.length === 0) return null;
    return (
      <View style={styles.control}>
        <Text style={styles.heading}>Cast</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.creditsContent}
          style={styles.credits}
        >
          {persons.map(credit => (
            <PersonCard
              key={credit.id}
              name={get(credit, 'cast.name')}
              pictureUrl={get(credit, 'cast.pictureUrl')}
              role={get(credit, 'role')}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  render() {
    const { data } = this.props;

    if (data.loading) {
      return (
        <View style={styles.host}>
          <ActivityIndicator />
        </View>
      );
    }

    const movie = this.applyLocale('ICELANDIC', data.movie);

    return (
      <View style={styles.host}>
        {this.renderSummary(movie.summary)}
        {this.renderCredits(movie.credits)}
        {this.renderCurrency('Budget', movie.budget)}
        {this.renderCurrency('Revenue', movie.revenue)}
        {this.renderReleaseDate(movie.releaseDate)}
        {this.renderLink('Homepage', movie.homepage)}
        {this.renderSection('Tagline', movie.tagline)}
        <ShowtimesWeek
          showtimes={movie.showtimes}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    padding: 30,
    backgroundColor: 'transparent',
  },

  heading: {
    fontWeight: '400',
    fontSize: 16,
    color: 'rgba(255,255,255,0.87)',
    marginBottom: 5,
  },

  control: {
    marginBottom: 20,
  },

  text: {
    fontWeight: '100',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
  },

  credits: {
    marginHorizontal: -30,
  },

  creditsContent: {
    paddingLeft: 30,
    paddingRight: 10,
  },
});
