import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./Home.css";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import { IconButton } from "@material-ui/core";

function Home() {
  const history = useHistory();
  const [numberOfPlayers, setNumberOfPlayers] = useState(2);

  return (
    <div className="home">
      <Header />
      <div className="home__container">
        <h1>Number of Players :</h1>
        <div className="addPlayers">
          <IconButton
            onClick={() =>
              numberOfPlayers > 2 && setNumberOfPlayers(numberOfPlayers - 1)
            }
          >
            <RemoveIcon style={{ fill: "white", fontSize: 40 }} />
          </IconButton>
          <h1 className="players__count">{numberOfPlayers}</h1>
          <IconButton
            onClick={() =>
              numberOfPlayers < 5 && setNumberOfPlayers(numberOfPlayers + 1)
            }
          >
            <AddIcon style={{ fill: "white", fontSize: 40 }} />
          </IconButton>
        </div>
        <div
          className="game__button"
          onClick={() =>
            history.push({
              pathname: "/game",
              state: {
                numberOfPlayers: numberOfPlayers,
              },
            })
          }
        >
          Game
        </div>
      </div>
    </div>
  );
}

export default Home;
