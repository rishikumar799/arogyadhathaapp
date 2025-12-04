import React from 'react';
import { IconSymbol } from './icon-symbol';

export default function IconWrapper({ name, size = 20, color }: { name: string; size?: number; color?: string }) {
  return <IconSymbol name={name} size={size} color={color} />;
}
