
import { useCallback } from '@wordpress/element';
import { Card } from './Card';
import update from 'immutability-helper'

export const SliderContainer = ({ cards, setCards }) => {
    {
        const moveCard = useCallback((dragIndex, hoverIndex) => {
            setCards((prevCards) =>
                update(prevCards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                    ],
                }),
            )
        }, [])
        const renderCard = useCallback((card, index) => {
            return (
                <>
                    <Card
                        key={card.id}
                        index={index}
                        id={card.id}
                        text={card.text}
                        moveCard={moveCard}
                        clientId={card.clientId}
                    />
                </>
            )
        }, [])
        return <div>{cards.map((card, i) => renderCard(card, i))}</div>
    }

}