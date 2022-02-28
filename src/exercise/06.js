// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import React, { useState, useEffect } from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'

class ErrorBoundary extends React.Component {
  state = {error: null}
  static getDerivedStateFromError(error) {
    return {error}
  }
  render() {
    const {error} = this.state
    if (error) {
      return <this.props.FallbackComponent error={error} />
    }

    return this.props.children
  }
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function PokemonInfo({ pokemonName }) {
  const [ state, setState ] = useState({ pokemon: null, status: `idle`, error: null })

  useEffect(() => {
    if(!pokemonName){
      return
    }
      setState({ status: `pending` })

      fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({ pokemon: pokemonData, status: `resolved`})
      })
      .catch(error => {
        setState({ error, status: `rejected`})
      })
  }, [ pokemonName ])

  const { status, pokemon, error } = state;

  if(status === `rejected`){
    throw error
  }
  else if(status === `idle`){
    return `Submit a pokemon`
  }
  else if(status === `pending`){
    return <PokemonInfoFallback name={pokemonName} />
  }
  else if(status === `resolved`){
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
