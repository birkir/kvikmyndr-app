import * as React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { IMovie } from 'store/models/Movie';
import { observer } from 'mobx-react/native';
import { format } from 'date-fns';
import TextMore from 'components/text-more/TextMore';
import Credits from './Credits';
import Section from './Section';
import { openUrl } from 'utils/openUrl';
import { Store } from 'store';
const styles = require('./MovieDetails.css');

interface IProps {
  movie: IMovie;
}

const SectionLink = ({ title, value }: { title: string; value?: any }) => value ? (
  <Section title={title}>
    <TouchableOpacity onPress={() => openUrl(value)}>
      <Text style={styles.text}>{value}</Text>
    </TouchableOpacity>
  </Section>
) : null;

const SectionText = ({ title, value }: { title: string; value?: any; }) => value ? (
  <Section title={title}>
    <Text style={styles.text}>{value}</Text>
  </Section>
) : null;

const SectionCurrency = ({ title, value }: { title: string; value?: number | null }) => !!value ? (
  <SectionText
    title={title}
    value={value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}
  />
) : null;

@observer
export default class MovieDetails extends React.Component<IProps, {}> {
  render() {
    const { movie } = this.props;

    if (movie.isPartial) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    const showSummary = movie.locale.summary && !Store.settings.hideSynopsis;

    return (
      <View style={styles.host}>

        {showSummary && (
          <Section title="Summary">
            <TextMore style={styles.text}>{movie.locale.summary}</TextMore>
          </Section>
        )}
        <Credits
          credits={movie.credits}
        />
        <SectionCurrency
          title="Budget"
          value={movie.budget}
        />
        <SectionCurrency
          title="Budget"
          value={movie.revenue}
        />
        <SectionText
          title="First Released"
          value={movie.releaseDate && format(movie.releaseDate, 'MMMM do, yyyy')}
        />
        <SectionLink
          title="Homepage"
          value={movie.homepage}
        />
        <SectionText
          title="Tagline"
          value={movie.tagline}
        />
      </View>
    );
  }
}
