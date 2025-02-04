import React from 'react'
import ListaFlujos from './ListaFlujos'

const GestorFlujoView = () => {
  return (
    <div>
        <div className='header'>
            <h1>Gestor de flujos</h1>
        </div>
        <div className='content'>
            <ListaFlujos/>
        </div>
    </div>
  )
}

export default GestorFlujoView