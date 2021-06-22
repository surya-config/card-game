import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SUITS, VALUES } from "./CardValues";
import "./Game.css";

function Game() {
  const location = useLocation();
  const [cards, setCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [winner, setWinner] = useState(null);
  const [playerIndex, setPlayerIndex] = useState(0);
  const [cardPickStep, setCardPickStep] = useState(3);
  const [game2, setGame2] = useState([]);

  console.log({ players });

  useEffect(() => {
    let data = freshDeck();
    setCards(data);
  }, []);

  useEffect(() => {
    if (winner) {
      initializePlayers(players.length);
    }
  }, [setWinner]);

  useEffect(() => {
    if (location.state.numberOfPlayers) {
      initializePlayers(location.state.numberOfPlayers);
    }
  }, [location]);

  const initializePlayers = (num) => {
    let temp = [];
    for (let i = 0; i < num; i++) {
      let name = `Player ${i + 1}`;
      temp.push({
        cards: [],
        all3Same: false,
        sequential: false,
        pair: false,
        name: name,
      });
    }
    setPlayers(temp);
    setPlayerIndex(0);
    setCardPickStep(3);
  };

  const freshDeck = () => {
    // Reset all players cards
    // setPlayer1({
    //   turn: true,
    //   cards: [],
    // });
    // setPlayer2({
    //   turn: false,
    //   cards: [],
    // });
    // setPlayer3({
    //   turn: false,
    //   cards: [],
    // });
    // setPlayer4({
    //   turn: false,
    //   cards: [],
    // });
    // Combining the SUITS and VALUES to get 52 Cards
    let temp = SUITS.flatMap((suit) => {
      return VALUES.map((value) => {
        return { suit: suit, value: value };
      });
    });

    // Shuffle the cards
    for (let i = temp.length - 1; i >= 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = temp[newIndex];
      temp[newIndex] = temp[i];
      temp[i] = oldValue;
    }
    return temp;
  };

  const containsObject = (obj, list) => {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return i;
      }
    }

    return 0;
  };

  const handleDeckClick = () => {
    let temp = [...cards];
    if (cardPickStep === 3) {
      let tempPlayers = [...players];
      // Adding cards to the players
      for (let i = 0; i < cardPickStep; i++) {
        let poppedCard = temp.pop();
        tempPlayers[playerIndex].cards.push(poppedCard);
      }
      setCards(temp);
      setPlayers(tempPlayers);
      setPlayerIndex(playerIndex + 1);
      // If the last player is selecting the last card we need to determine the winner
      setTimeout(() => {
        if (players[players.length - 1].cards.length === cardPickStep) {
          setCardPickStep(0);
          setPlayerIndex(-1);
          checkWinner();
        }
      }, 600);

      // Checking the conditions and changing the states accordingly
      players.map((player, i) => {
        if (player.cards.length === 3) {
          getIdenticalCount(
            player.cards[0].value,
            player.cards[1].value,
            player.cards[2].value,
            i
          );
        }
      });
    } else {
      if (containsObject(players[playerIndex], game2)) {
        let tiePlayers = [...game2];
        // Adding cards to the players
        let poppedCard = temp.pop();
        tiePlayers[playerIndex].cards.push(poppedCard);

        setCards(temp);
        setGame2(tiePlayers);
        setPlayerIndex(playerIndex + 1);
        // If the last player is selecting the last card we need to determine the winner
        setTimeout(() => {
          if (players[players.length - 1].cards.length === cardPickStep) {
            setCardPickStep(0);
            setPlayerIndex(-1);
            checkWinner();
          }
        }, 600);
      } else {
        setPlayerIndex(playerIndex + 1);
      }
    }
  };

  // Evaluting the first three conditions
  const getIdenticalCount = (x, y, z, i) => {
    let temp = [...players];
    if (x === y && y === z) {
      console.log("same");
      temp[i].all3Same = true;
    }
    if (x === y || y === z || z === x) {
      temp[i].pair = true;
    }

    if (y === x + 1 && z === y + 1) {
      temp[i].sequential = true;
    }

    setPlayers(temp);
  };

  // Top card comparison
  const evaluateTopCard = (arr) => {
    let sortedBasedOnTopCard;
    if (arr.length === 0) {
      sortedBasedOnTopCard = players.sort(
        (a, b) =>
          (VALUES.indexOf(a.cards[a.cards.length - 1].value) >
            VALUES.indexOf(b.cards[b.cards.length - 1].value) &&
            1) ||
          -1
      );
    } else {
      sortedBasedOnTopCard = arr.sort(
        (a, b) =>
          (VALUES.indexOf(a.cards[a.cards.length - 1].value) >
            VALUES.indexOf(b.cards[b.cards.length - 1].value) &&
            1) ||
          -1
      );
    }

    if (sortedBasedOnTopCard) {
      console.log(
        sortedBasedOnTopCard[0]?.cards[sortedBasedOnTopCard[0].cards.length - 1]
          .value,
        sortedBasedOnTopCard[1]?.cards[sortedBasedOnTopCard[1].cards.length - 1]
          .value
      );
      if (
        sortedBasedOnTopCard[0]?.cards[sortedBasedOnTopCard[0].cards.length - 1]
          .value !==
        sortedBasedOnTopCard[1]?.cards[sortedBasedOnTopCard[1].cards.length - 1]
          .value
      ) {
        setWinner(sortedBasedOnTopCard[0]);
        alert(`${sortedBasedOnTopCard[0].name} wins`);
      } else {
        if (
          sortedBasedOnTopCard[0]?.cards[
            sortedBasedOnTopCard[0].cards.length - 1
          ].value ===
          sortedBasedOnTopCard[1]?.cards[
            sortedBasedOnTopCard[1].cards.length - 1
          ].value
        ) {
          alert(
            "Its a Tie! Pick one card on each side to determine the winner."
          );
          setPlayerIndex(0);
          setCardPickStep(1);
          let temp = [];
          let val =
            sortedBasedOnTopCard[0].cards[
              sortedBasedOnTopCard[0].cards.length - 1
            ].value;
          sortedBasedOnTopCard.map((player) => {
            if (player.cards[player.cards.length - 1].value === val) {
              temp.push(player);
            }
          });
          setGame2(temp);
          setPlayerIndex(containsObject(sortedBasedOnTopCard[0], game2));
        }
      }
    }
  };

  console.log({ cardPickStep, playerIndex, players, game2 });

  const checkWinner = () => {
    if (cardPickStep === 3) {
      // Get the players whose all three cards are same.
      let tempWinner = players.filter((player) => player.all3Same === true);
      console.log("1");
      if (tempWinner.length === 0) {
        console.log("2");
        // Get the players whose cards are in sequential order.
        tempWinner = players.filter((player) => player.sequential === true);
        console.log("Sequential : ", tempWinner);
        if (tempWinner.length === 0) {
          console.log("3");
          // Get the players who has two pairs of cards with same value.
          tempWinner = players.filter((player) => player.pair === true);
          console.log("Pair : ", tempWinner);

          if (tempWinner.length === 1) {
            console.log("4");
            setWinner(tempWinner);
            alert(`${tempWinner[0].name} wins`);
          } else {
            console.log("5");
            evaluateTopCard(tempWinner);
          }
        } else if (tempWinner.length === 1) {
          console.log("6");
          setWinner(tempWinner);
          alert(
            "Its a Tie! Pick one card on each side to determine the winner."
          );
        } else {
          console.log("7");
          evaluateTopCard(tempWinner);
        }
      } else if (tempWinner.length === 1) {
        setWinner(tempWinner);
        alert(`${tempWinner[0].name} wins`);
      }
    } else {
      evaluateTopCard();
    }
  };

  return (
    <div className="game">
      <div className="game__container">
        {/* Container for the players */}
        <div className="players__container">
          {cardPickStep === 3 || cardPickStep === 0
            ? players.map((player, i) => (
                <div
                  className={`player__container ${
                    playerIndex === i && "currentPlaying"
                  }`}
                >
                  <h1>{player.name}</h1>
                  {player.cards.length === 0 ? (
                    <h4>Pick three cards from the deck</h4>
                  ) : (
                    <div
                      className={`cards__row ${
                        player.cards.length === 3 &&
                        i % 2 !== 0 &&
                        "align__right"
                      }`}
                    >
                      {player.cards?.map((card) => (
                        <div
                          className={`card ${
                            card.suit === "♣" || card.suit === "♠"
                              ? "black"
                              : "red"
                          }`}
                          data-value={`${card.value} ${card.suit}`}
                        >
                          {card.suit}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            : game2.map((player, i) => (
                <div
                  className={`player__container ${
                    playerIndex === i && "currentPlaying"
                  }`}
                >
                  <h1>{player.name}</h1>
                  {player.cards.length === 0 ? (
                    <h4>Pick three cards from the deck</h4>
                  ) : (
                    <div
                      className={`cards__row ${
                        player.cards.length === 3 &&
                        i % 2 !== 0 &&
                        "align__right"
                      }`}
                    >
                      {player.cards?.map((card) => (
                        <div
                          className={`card ${
                            card.suit === "♣" || card.suit === "♠"
                              ? "black"
                              : "red"
                          }`}
                          data-value={`${card.value} ${card.suit}`}
                        >
                          {card.suit}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
        </div>

        {/* Container for the deck */}
        <div className="deck__container">
          <h3>Deck</h3>
          <div
            className="card black deckLength__text"
            onClick={handleDeckClick}
          >
            {cards.length} Cards
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
