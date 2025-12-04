import React from 'react';
import { Switch as RNSwitch } from 'react-native';

export default function Switch({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) {
  return <RNSwitch value={value} onValueChange={onValueChange} />;
}
