import Grid from "@material-ui/core/Grid";
import {WhiteCard} from "../../../UI/WhiteCard";
import Button from "@material-ui/core/Button";
import * as React from "react";
import {IGameDataStorePayload} from "../../../Global/DataStore/GameDataStore";
import {IUserData} from "../../../Global/DataStore/UserDataStore";
import {useState} from "react";

interface Props
{
	gameData: IGameDataStorePayload;
	userData: IUserData;
	targetPicked: number;
	onPickUpdate: (cards: number[]) => void;
}

export const WhiteCardHand: React.FC<Props> =
	({
		 userData,
		 gameData,
		 targetPicked,
		 onPickUpdate
	 }) =>
	{
		const [pickedCards, setPickedCards] = useState<number[]>([]);

		const onPick = (id: number) =>
		{
			const newVal = [...pickedCards, id];
			setPickedCards(newVal);
			onPickUpdate(newVal);
		};

		const onUnpick = (id: number) =>
		{
			const newVal = pickedCards.filter(a => a !== id);
			setPickedCards(newVal);
			onPickUpdate(newVal);
		};

		if (!gameData.game)
		{
			return null;
		}

		const {
			players,
			roundCards,
		} = gameData.game;

		const me = players[userData.playerGuid];

		const cardDefsLoaded = Object.values(roundCards ?? {}).length === 0 || Object.keys(gameData.roundCardDefs).length > 0;

		if (!me || !cardDefsLoaded)
		{
			return null;
		}

		const whiteCards = Object.values(gameData.playerCardDefs);

		const hasPlayed = userData.playerGuid in roundCards;

		const renderedWhiteCards = hasPlayed
			? roundCards[userData.playerGuid].map(cid => gameData.roundCardDefs[cid]).filter(a => !!a)
			: whiteCards;

		const metPickTarget = targetPicked <= pickedCards.length;

		const renderedHand = renderedWhiteCards.map(card =>
		{
			const pickedIndex = pickedCards.indexOf(card.id);
			const picked = pickedIndex > -1;
			const label = picked
				? targetPicked > 1
					? `Picked: ${pickedIndex + 1}`
					: "Picked"
				: "Pick";

			return (
				<Grid item xs={12} sm={6} md={4}>
					<WhiteCard
						key={card.id}
						actions={!hasPlayed && (
							<>
								<Button
									variant={"contained"}
									color={"primary"}
									disabled={metPickTarget || pickedCards.includes(card.id)}
									onClick={() => onPick(card.id)}
								>
									{label}
								</Button>
								<Button
									variant={"contained"}
									color={"primary"}
									disabled={!pickedCards.includes(card.id)}
									onClick={() => onUnpick(card.id)}
								>
									Unpick
								</Button>
							</>
						)}
					>
						{card.response}
					</WhiteCard>
				</Grid>
			);
		});

		return <>
			{renderedHand}
		</>;
	};