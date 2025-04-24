import React, { FunctionComponent } from 'react';
import { Text } from '../../../components/controls/text/text';
import { Reply } from './reply';
import { ThemedRect, ThemedPath } from '../../../components/theme/themedComponents';

interface Props {
  element: Reply;
  children?: React.ReactNode;
  fillColor?: string;
}

export const ReplyComponent: FunctionComponent<Props> = ({ element, children, fillColor }) => {
  const cornerRadius = 8;

  return (
    <g>
      <ThemedRect
        fillColor={fillColor || element.fillColor}
        strokeColor="none"
        width="100%"
        height={element.stereotype ? 50 : 40}
        rx={cornerRadius}
      />
      <ThemedRect
        y={element.stereotype ? 50 : 40}
        width="100%"
        height={element.bounds.height - (element.stereotype ? 50 : 40)}
        strokeColor="none"
        rx={cornerRadius}
      />
      {element.stereotype ? (
        <svg height={50}>
          <Text fill={element.textColor}>
            <tspan x="50%" dy={-8} textAnchor="middle" fontSize="85%">
              {`«${element.stereotype}»`}
            </tspan>
            <tspan
              x="50%"
              dy={18}
              textAnchor="middle"
              fontStyle={element.italic ? 'italic' : undefined}
              textDecoration={element.underline ? 'underline' : undefined}
            >
              {element.name}
            </tspan>
          </Text>
        </svg>
      ) : (
        <svg height={40}>
          <Text
            fill={element.textColor}
            fontStyle={element.italic ? 'italic' : undefined}
            textDecoration={element.underline ? 'underline' : undefined}
          >
            Reply
          </Text>
          <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 16 16"
        x="80%"
        y="0"
      >
        <path
          fill="currentColor"
          d="M7 2a5 5 0 0 0-4.533 7.113l-.457 2.289a.5.5 0 0 0 .588.588l2.288-.457A5 5 0 1 0 7 2M3 7a4 4 0 1 1 2.182 3.564a.5.5 0 0 0-.326-.045l-1.719.344l.344-1.72a.5.5 0 0 0-.045-.325A4 4 0 0 1 3 7m6 7a4.98 4.98 0 0 1-3.14-1.108a6 6 0 0 0 2.242.007a4 4 0 0 0 2.716-.335a.5.5 0 0 1 .326-.045l1.719.344l-.344-1.72a.5.5 0 0 1 .045-.325a4 4 0 0 0 .335-2.716a6 6 0 0 0-.007-2.24A4.98 4.98 0 0 1 14 9a5 5 0 0 1-.467 2.114l.457 2.288a.5.5 0 0 1-.588.588l-2.289-.457A5 5 0 0 1 9 14"
        />
      </svg>
        </svg>
      )}
      {children}
      <ThemedRect 
        width="100%" 
        height="100%" 
        strokeColor={element.strokeColor} 
        fillColor="none" 
        pointer-events="none"
        rx={cornerRadius}
      />
      {element.hasBody && (
        <ThemedPath d={`M 0 ${element.headerHeight} H ${element.bounds.width}`} strokeColor={element.strokeColor} />
      )}

    </g>
  );
}; 