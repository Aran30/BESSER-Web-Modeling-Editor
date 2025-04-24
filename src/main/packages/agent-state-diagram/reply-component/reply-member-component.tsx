import React, { FunctionComponent } from 'react';
import { Text } from '../../../components/controls/text/text';
import { ReplyMember } from './reply-member';
import { ThemedRect } from '../../../components/theme/themedComponents';

interface Props {
  element: ReplyMember;
  fillColor?: string;
}

export const ReplyMemberComponent: FunctionComponent<Props> = ({ element, fillColor }) => {
  return (
    <g>
      <ThemedRect fillColor={fillColor || element.fillColor} strokeColor="none" width="100%" height="100%" />
      <Text x={10} fill={element.textColor} fontWeight="normal" textAnchor="start">
        {element.name}

      </Text>
      
    </g>
    
  );
}; 