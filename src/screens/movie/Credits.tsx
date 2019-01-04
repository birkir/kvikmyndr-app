import * as React from 'react';
import { ScrollView } from 'react-native';
import { observer } from 'mobx-react/native';
import { ICredit } from 'store/models/Credit';
import Section from './Section';
import PersonCard from 'components/person-card/PersonCard';
import Store from 'store';
const styles = require('./Credits.css');

interface IProps {
  credits?: ICredit[];
}

@observer
export default class Credits extends React.Component<IProps, {}> {

  renderCredit(credit: ICredit) {
    const { name, pictureUrl } = credit!.cast!;

    if (!name && !pictureUrl) {
      return null;
    }

    return (
      <PersonCard
        key={credit.id}
        name={name}
        pictureUrl={pictureUrl}
      />
    );
  }

  render() {
    const { credits } = this.props;

    if (Store.settings.hideCast || !credits || credits.length === 0) {
      return null;
    }

    return (
      <Section title={Store.settings.locale.CAST}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.credits__content}
          style={styles.credits}
        >
          {credits.map(this.renderCredit)}
        </ScrollView>
      </Section>
    );
  }
}
