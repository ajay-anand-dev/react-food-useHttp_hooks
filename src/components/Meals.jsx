import { useEffect, useState } from "react"
import Meal from "./MealItem";

export default function Meals() {
    const [loadedMeals, setLoadedMeals] = useState([]);

    useEffect(() => {
        async function fetchMeals() {
            try {
                const response = await fetch('http://localhost:3000/meals')
                // if (!response.ok) {

                // }
                const meals = await response.json();
                setLoadedMeals(meals);
            } catch (error) {
                console.log(error)
            }
        }

        fetchMeals();
    }, [])

    return (
        <ul id='meals'>
            {loadedMeals.map(meal => (
                <Meal key={meal.id} meal={meal} />
            ))}
        </ul>
    )
}