import React from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Props = {
  name: string;
  size?: number;
  color?: string;
  weight?: 'regular' | 'medium' | 'bold';
};

export default function Icon({ name, size = 20, color, weight }: Props) {
  return <IconSymbol name={name} size={size} color={color} weight={weight} />;
}
