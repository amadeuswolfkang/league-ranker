// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import "./App.css";

import { Button, Card, CardBody, Icon } from "@chakra-ui/react";
import { IoPersonCircleSharp } from "react-icons/io5";

import { Text } from "@chakra-ui/react";

import { Input, InputGroup, InputLeftElement, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React, { useRef } from "react";
import { Spinner } from "@chakra-ui/react";

// import { KeyboardEvent } from "react";
// import { KeyboardEventHandler } from "react";

const API_URL = "na1.api.riotgames.com";
// const API_KEY = process.env.REACT_APP_API_KEY;

// let iconID = 0;

//This line must be removed!
// let iconURL = `http://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${iconID}.png`;

export default function App() {
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [leagueData, setLeagueData] = useState<LeagueData[]>([]);
  const [textInput, setTextInput] = useState("");
  const [spinner, setSpinner] = useState(false);
  const inputValueRef = useRef("");

  const handleButtonClick = () => {
    // get the input field's value
    setSummonerData(null);
    setLeagueData([]);
    setTextInput(inputValueRef.current);
  };

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      setSummonerData(null);
      setLeagueData([]);
      setTextInput(event.currentTarget.value);
    }
  };

  type LeagueData = {
    queueType: string;
    tier: string;
    rank: string;
    wins: number;
    losses: number;
    leaguePoints: number;
  };

  // type annotation
  type SummonerData = {
    name: string;
    summonerLevel: number;
    // include other properties as needed
  };

  useEffect(() => {
    // Summoner name length is between 3 and 16 characters inclusive.
    if (textInput.length >= 3 && textInput.length <= 16) {
      const fetchData = async () => {
        try {
          setSpinner(true);
          const summonerResponse = await fetch(
            `https://${API_URL}/lol/summoner/v4/summoners/by-name/${textInput}?api_key=${
              import.meta.env.VITE_API_KEY
            }`
          );
          const summonerJson = await summonerResponse.json();
          setSummonerData(summonerJson);
          // iconID = summonerJson.profileIconId;
          // iconURL = `http://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${iconID}.png`;

          const leagueResponse = await fetch(
            `https://${API_URL}/lol/league/v4/entries/by-summoner/${
              summonerJson.id
            }?api_key=${import.meta.env.VITE_API_KEY}`
          );
          const leagueJson = await leagueResponse.json();
          setLeagueData(leagueJson);
          console.log(leagueData);
        } catch (error) {
          console.error(error);
        } finally {
          setSpinner(false);
        }
      };

      fetchData();
    }
  }, [textInput]);

  function renderSummonerData() {
    if (summonerData && summonerData.name !== "Undefined") {
      return (
        <div>
          {/* Debugging */}
          {/* summonerData:
          <pre>{JSON.stringify(summonerData, null, 2)}</pre> */}
          <Text fontSize="3xl" fontWeight="bold">
            {summonerData.name}
          </Text>
          <Text fontSize="1xl" marginBottom="1rem">
            Level {summonerData.summonerLevel}
          </Text>
        </div>
      );
    } else if (textInput) {
      return <pre>No player data found.</pre>;
    }
  }

  function LeagueCard({ data }: { data: LeagueData }) {
    return (
      <div>
        <Card marginBottom="1rem">
          <CardBody>
            <Text fontSize="2xl" align="center" fontWeight="bold">
              {data.queueType === "RANKED_SOLO_5x5" ? "SOLO/DUO" : "FLEX"}
            </Text>
            <Text fontSize="2xl" align="center">
              {data.tier} {data.rank}
            </Text>
            <Text fontSize="lg" align="center" marginBottom="1rem">
              {data.leaguePoints} LP
            </Text>
            <Text fontSize="1xl" align="left">
              Total matches: {data.wins + data.losses}
            </Text>
            <Text fontSize="1xl" align="left">
              Wins: {data.wins}
            </Text>
            <Text fontSize="1xl" align="left">
              Losses: {data.losses}
            </Text>
            <br />
            <Text fontSize="1xl" align="left">
              Win-loss ratio: {(data.wins / data.losses).toFixed(2)}
            </Text>
            <Text fontSize="1xl" align="left">
              Win-loss rate:{" "}
              {((data.wins / (data.losses + data.wins)) * 100).toFixed(1) + "%"}
            </Text>
          </CardBody>
        </Card>
      </div>
    );
  }

  function renderLeagueRanks(): React.ReactNode {
    if (spinner) {
      return <pre>Loading league ranks...</pre>;
    }
  
    if (summonerData) {
      return leagueData.map((data, i) => <LeagueCard key={i} data={data} />);
    }
  
    if (textInput) {
      return <pre>No rank data found.</pre>;
    }
  }

  return (
    <>
      <Stack spacing={4}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={IoPersonCircleSharp} color="gray.300" fontSize="1.5em" />
          </InputLeftElement>
          <Input
            variant="outline"
            placeholder="Player"
            id="playerName"
            onKeyUp={handleKeyPress}
            onChange={(e) => {
              inputValueRef.current = e.target.value;
            }}
          />
        </InputGroup>
        <Button
          onClick={handleButtonClick}
          colorScheme="blue"
          marginBottom="1rem"
        >
          Search
        </Button>
      </Stack>

      {renderSummonerData()}

      <div className="output">
        {renderLeagueRanks()}
        {spinner ? <Spinner /> : null}
        {/* rest of your component */}
      </div>

      {/* <pre>{JSON.stringify(leagueData, null, 2)}</pre> */}
    </>
  );
}
