import React, { useState, useEffect } from "react";

import "./App.css";

// Common Expressions
const capFirstLetter = (string) => {
	return string.replace(string[0], string[0].toUpperCase());
};

const randomIntegerNumber = (limSup, limInf = 0) => {
	if (limSup > limInf) {
		return Math.round(limInf + Math.random() * (limSup - limInf));
	} else {
		throw new Error("limInf is greater than or equal to limSup");
	}
};

const pokemonApiLength = 898;

// App

function App() {
	const [pokemonsArray, setPokemonsArray] = useState([]);
	const [rightPokemonNumber, setRightPokemonNumber] = useState(
		randomIntegerNumber(3)
	);
	const [imgState, setImgState] = useState("hidden");
	const [rightAnswer, setRightAnswer] = useState(false);
	const [wrongAnswer, setWrongAnswer] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (pokemonsArray.length < 4) {
			setIsLoading(true);
			fetch(
				`https://pokeapi.co/api/v2/pokemon/${randomIntegerNumber(
					pokemonApiLength,
					1
				)}`
			)
				.then((response) => response.json())
				.then((response) => {
					setPokemonsArray((prevPokemons) => [...prevPokemons, response]);
					setIsLoading(false);
				});
		}
	}, [pokemonsArray]);

	const rightAnswerHandler = (event) => {
		event.preventDefault();
		setImgState("visible");
		setRightAnswer(true);
	};
	const wrongAnswerHandler = (event) => {
		event.preventDefault();
		setImgState("visible");
		setWrongAnswer(true);
	};

	let pokemonImage = null;
	if (isLoading) {
		pokemonImage = <p className="loading">Loading...</p>;
	}
	if (pokemonsArray[rightPokemonNumber]) {
		pokemonImage = (
			<img
				className={imgState}
				src={pokemonsArray[rightPokemonNumber].sprites.front_default}
				alt="Pokemon Image"
			/>
		);
	}
	let options =
		pokemonsArray.map((pokemon, index) => {
			if (index === rightPokemonNumber) {
				return (
					<button
						key={pokemon.name}
						className="option"
						onClick={(event) => rightAnswerHandler(event)}
					>
						{capFirstLetter(pokemon.name)}
					</button>
				);
			} else {
				return (
					<button
						key={pokemon.name}
						className="option"
						onClick={(event) => wrongAnswerHandler(event)}
					>
						{capFirstLetter(pokemon.name)}
					</button>
				);
			}
		}) || null;

	if (rightAnswer) {
		options = (
			<p>
				Well done! It was{" "}
				{capFirstLetter(pokemonsArray[rightPokemonNumber].name)}
			</p>
		);
	}
	if (wrongAnswer) {
		options = (
			<p>
				You lose! It was{" "}
				{capFirstLetter(pokemonsArray[rightPokemonNumber].name)}
			</p>
		);
	}

	return (
		<div className="App">
			<h1>Who's that Pokémon?</h1>
			{pokemonImage}
			{options}
			<button
				className="try-another"
				onClick={() => {
					window.location.reload();
				}}
			>
				Try another
			</button>
		</div>
	);
}

export default App;
