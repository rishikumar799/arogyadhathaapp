import React from 'react';
import Icon from './Icon';

export default function PregnantLadyIcon({ size = 20, color }: { size?: number; color?: string }) {
  // Use a generic user/female icon as placeholder
  return <Icon name="user" size={size} color={color} />;
}
