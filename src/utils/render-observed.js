import React from 'react';
import { Observer } from 'mobx-react/native';

export default function renderObserved(child) {
  return <Observer>{child}</Observer>;
}
