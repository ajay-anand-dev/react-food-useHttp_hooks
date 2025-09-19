import { useEffect, useState } from "react"
import Meal from "./MealItem";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

const requestConfig = {};

export default function Meals() {
    const {
        data: loadedMeals,
        isLoading,
        error
    } = useHttp('http://localhost:3000/meals', requestConfig, []);

    // } = useHttp('http://localhost:3000/meals', {}, []); // {} if we'll create an empty object here then at every render a new object will be created, otherwise in useHttp it will go to the infinite loop as the config value is getting created again.

    // [] initialState, {} for config

    if (isLoading) {
        return <p className="center">Fetching meals...</p>
    }

    if (error) {
        return <Error title="Failed to fetch meals" message={error} />
    }

    return (
        <ul id='meals'>
            {loadedMeals.map(meal => (
                <Meal key={meal.id} meal={meal} />
            ))}
        </ul>
    )
}