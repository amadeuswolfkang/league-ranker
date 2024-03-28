import React, { useEffect, useState, useRef } from "react";
import { Button, Card, CardBody, Text, Input, InputGroup, Stack, Spinner } from "@chakra-ui/react";

import "./App.css";

const API_URL = "na1.api.riotgames.com";

export default function App() {
  const [summonerData, setSummonerData] = useState<SummonerData | null>(null);
  const [leagueData, setLeagueData] = useState<LeagueData[]>([]);
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);
  const inputValueRef = useRef("");

  const handleButtonClick = () => {
    // Preserve data if same search, clear data for new search
    if (textInput != inputValueRef.current) {
      setSummonerData(null);
      setLeagueData([]);
    }

    setTextInput(inputValueRef.current);
  };

  const handleKeyPress: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key === "Enter") {
      // Preserve data if same search, clear data for new search
      if (textInput != inputValueRef.current) {
        setSummonerData(null);
        setLeagueData([]);
      }
      setTextInput(event.currentTarget.value);
    }
  };

  // TYPE DEFINITIONS FOR API RESPONSES
  type LeagueData = {
    queueType: string;
    tier: string;
    rank: string;
    wins: number;
    losses: number;
    leaguePoints: number;
  };

  type SummonerData = {
    name: string;
    summonerLevel: number;
  };

  useEffect(() => {
    // Summoner name length is between 3 and 16 characters inclusive.
    if (textInput.length >= 3 && textInput.length <= 16) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const summonerResponse = await fetch(
            `https://${API_URL}/lol/summoner/v4/summoners/by-name/${textInput}?api_key=${
              import.meta.env.VITE_API_KEY
            }`
          );
          const summonerJson = await summonerResponse.json();
          setSummonerData(summonerJson);

          const leagueResponse = await fetch(
            `https://${API_URL}/lol/league/v4/entries/by-summoner/${
              summonerJson.id
            }?api_key=${import.meta.env.VITE_API_KEY}`
          );
          const leagueJson = await leagueResponse.json();
          setLeagueData(leagueJson);
          console.log("League data", leagueData);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [textInput]);

  function renderSummonerData() {
    if (loading) {
      return (
        <div>
          <Spinner />
          <pre>Loading player data</pre>
        </div>
      );
    }

    if (summonerData && summonerData.name !== "Undefined") {
      return (
        <div>
          <Text fontSize="3xl" fontWeight="bold">
            {summonerData.name}
          </Text>
          <Text fontSize="1xl" marginBottom="1rem">
            Level {summonerData.summonerLevel}
          </Text>
        </div>
      );
    }

    // Checks for text input to prevent error message when input is empty
    if (textInput) {
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
    if (loading) {
      return (
        <div>
          <Spinner />
          <pre>Loading league rank data</pre>
        </div>
      );
    }

    if (leagueData.length > 0) {
      console.log("Rendering league data.");
      return leagueData.map((data, i) => <LeagueCard key={i} data={data} />);
    }

    // Checks for text input to prevent error message when input is empty
    if (textInput) {
      console.log("No rank data found.");
      return <pre>No rank data found.</pre>;
    }
  }

  return (
    <>
      <Stack spacing={4}>
        <InputGroup>
          <Input
            variant="outline"
            placeholder="Search a player"
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

      <div>{renderSummonerData()}</div>

      <div className="output">{renderLeagueRanks()}</div>
    </>
  );
}
