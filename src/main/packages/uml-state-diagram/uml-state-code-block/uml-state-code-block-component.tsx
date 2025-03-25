import React, { FunctionComponent } from 'react';
import { UMLStateCodeBlock } from './uml-state-code-block';
import { ThemedRect } from '../../../components/theme/themedComponents';

interface Props {
  element: UMLStateCodeBlock;
  fillColor?: string;
}

// Preserves tabs when displaying code
const preserveTabs = (str: string): string => {
  return str.replace(/\t/g, '    '); // Replace tabs with 4 spaces for rendering
};

// A simple function to escape HTML in code
const escapeHtml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const CodeContent: FunctionComponent<{ content: string, textColor: string }> = ({ content, textColor }) => {
  const fontSize = '13px';
  const paddingLeft = 10;
  const lineHeight = 14;
  
  const renderCodeLines = () => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const y = 20 + (index * lineHeight);
      const processedLine = preserveTabs(line);
      return (
        <foreignObject key={index} x={paddingLeft} y={y} width="95%" height={lineHeight}>
          <div 
            style={{ 
              fontSize, 
              color: textColor, 
              fontFamily: 'monospace', 
              whiteSpace: 'pre',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {processedLine}
          </div>
        </foreignObject>
      );
    });
  };

  return (
    <g>
      {renderCodeLines()}
    </g>
  );
};

export const UMLStateCodeBlockComponent: FunctionComponent<Props> = ({ element, fillColor }) => {
  const cornerRadius = 8;
  const headerHeight = 20;
  const contentCode = element.code || '';
  
  return (
    <g>
      {/* Background */}
      <ThemedRect
        width="100%"
        height="100%"
        fillColor={fillColor || element.fillColor}
        strokeColor={element.strokeColor}
        rx={cornerRadius}
      />
      
      {/* Header */}
      <ThemedRect
        width="100%"
        height={headerHeight}
        fillColor={element.strokeColor}
        strokeColor={element.strokeColor}
        rx={cornerRadius}
        ry={cornerRadius}
      />
      
      {/* Language Label (always Python) */}
      <text
        x={10}
        y={headerHeight / 2 + 5}
        fontSize="10px"
        fontFamily="sans-serif"
        fill="#fff"
        fontWeight="bold"
      >
        Python
      </text>
      
      {/* Code Content */}
      <CodeContent 
        content={contentCode}
        textColor={element.textColor || '#000'}
      />
    </g>
  );
};
