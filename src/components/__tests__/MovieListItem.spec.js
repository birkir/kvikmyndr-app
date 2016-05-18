/* eslint no-unused-expressions: 0 */
import React, { View } from 'react-native';
import { shallow } from 'enzyme';
import MovieListItem from '../MovieListItem.js';
import { expect } from 'chai';

describe('<MovieListItem />', () => {

  const props = {
    posterUrl: '/poster.jpg',
    title: 'Dummy movie list item',
    runtime: 123,
    rating: { imdbRating: 7.7 },
    showtimes: [{ hour: '15:00' }, { hour: '21:00' }, { hour: '21:10' }, { hour: '22:00' }],
  };

  const wrapper = shallow(<MovieListItem {...props} />);

  it('should render <View />', () => {
    expect(wrapper.is(View)).to.be.true;
  });

  it('should have flex styles', () => {
    expect(wrapper.prop('style').flex).to.equal(1);
  });

  it('should render title', () => {
    const title = wrapper.find('#title').get(0);
    expect(title.props.children).to.equal(props.title);
  });

  it('should render runtime', () => {
    const runtime = wrapper.find('#runtime').get(0);
    expect(runtime.props.children).to.equal('2 klst 3 mín');
  });

  it('should render poster', () => {
    const poster = wrapper.find('#poster').get(0);
    expect(poster.props.source.uri).to.equal(`http://image.tmdb.org/t/p/w500${props.posterUrl}`);
  });

  it('should render showtimes', () => {
    const showtimes = wrapper.find('#showtimes > Text');
    expect(showtimes.children().length).to.equal(3);
    expect(showtimes.children().nodes).deep.equal(['15:00', '21:00', '22:00']);
  });

  it('should not show minutes if only hours', () => {
    const newProps = props;
    props.runtime = 120;

    const wrapper = shallow(<MovieListItem {...newProps} />);

    const runtime = wrapper.find('#runtime').get(0);
    expect(runtime.props.children).to.equal('2 klst');
  });

});
