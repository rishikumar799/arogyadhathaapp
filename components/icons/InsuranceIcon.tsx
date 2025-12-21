import React from 'react';
import Icon from './Icon';

export default function InsuranceIcon({ size = 20, color }: { size?: number; color?: string }) {
  return <Icon name="shield-check" size={size} color={color} />;
}
