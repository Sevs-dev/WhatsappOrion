import React from 'react'

import DiagramaView from './DiagramaReactFlow/DiagramaView'




const FlujoVentana = () => {
  return (
    <div>
        <div className='header'>
            <h1>Gestor de flujo de procesos</h1>

        </div>

        <div className='content'>
          <DiagramaView/>
        </div>
    </div>
  )
}

export default FlujoVentana