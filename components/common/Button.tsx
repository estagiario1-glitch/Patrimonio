'use client'

import React from 'react'

const Button = (props: any) => {
  return (
    <div className={`flex ${props.reverse ? 'justify-end' : ''}`}>
        <button className={`w-fit align-text-bottom py-4 px-16 ${props.reverse ? 
            'rounded-tr-[8px] rounded-bl-[8px] rounded-tl-[32px] rounded-br-[32px]' :
            'rounded-tr-[32px] rounded-bl-[32px] rounded-tl-[8px] rounded-br-[8px]'} bg-red-400 text-white font-bold`}
            onClick={() => {
                location.href = props.goesTo
            }}>{props.title}</button>
    </div>
  )
}

export default Button