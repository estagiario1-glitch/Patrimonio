'use client'

import CountUp from 'react-countup';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;     
  className?: string;
  separator?: string;
  decimals?: number;   
  decimal?: string;    
}

export default function AnimatedCounter({ 
  value, 
  duration = 2.5, 
  prefix = '', 
  suffix = '',        
  className = '',
  separator = '.',
  decimals = 0,         
  decimal = ','         
}: AnimatedCounterProps) {
  return (
    <span className={className}>
      <CountUp 
        start={200}
        end={value} 
        duration={duration} 
        prefix={prefix} 
        suffix={suffix}   
        separator={separator}
        decimals={decimals} 
        decimal={decimal}    
      />
    </span>
  );
}